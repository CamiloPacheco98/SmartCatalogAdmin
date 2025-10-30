import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { StorageService } from '../../../../core/services/storage.service';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;
  editingUser: string | null = null;
  tempVerificationStatus: { [key: string]: boolean } = {};

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    await this.loadUsers();
  }

  _getCurrentUid(): string | null {
    return this.authService.getCurrentUid();
  }

  async loadUsers() {
    try {
      this.loading = true;
      this.error = null;
      const currentUid = this._getCurrentUid();
      if (currentUid) {
        const users = await this.firestoreService.getAllUsers(currentUid);
        users.forEach(async (user) => {
          const imagePath = await this.storageService.downloadFile(user.imagePath);
          user.imagePath = imagePath;
        });
        this.users = users;
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.error = 'Error al cargar los usuarios';
    } finally {
      this.loading = false;
    }
  }

  startEditing(user: User) {
    this.editingUser = user.id;
    this.tempVerificationStatus[user.id] = user.verified;
  }

  cancelEditing(user: User) {
    this.editingUser = null;
    delete this.tempVerificationStatus[user.id];
  }

  async updateUserStatus(user: User) {
    try {
      const newStatus = this.tempVerificationStatus[user.id];

      // Update in Firestore
      await this.firestoreService.updateUserStatus(user.id, newStatus);

      // Update local user object
      user.verified = newStatus;
      user.updatedAt = new Date();

      // Exit editing mode
      this.editingUser = null;
      delete this.tempVerificationStatus[user.id];

    } catch (error) {
      console.error('Error updating user status:', error);
      this.error = 'Error al actualizar el estad  o del usuario';
    }
  }
}