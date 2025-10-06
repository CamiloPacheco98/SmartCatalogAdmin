import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  uploadError: string | null = null;
  uploadSuccess = false;

  constructor() {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFileSelection(target.files[0]);
    }
  }

  private handleFileSelection(file: File): void {
    this.clearMessages();

    // Validate file type
    if (file.type !== 'application/pdf') {
      this.uploadError = 'Please select a valid PDF file.';
      return;
    }

    // Validate file size (25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > maxSize) {
      this.uploadError = 'File size must be less than 25MB.';
      return;
    }

    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
    this.clearMessages();
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.clearMessages();

    // Simulate upload process
    // In a real application, you would upload to your backend service here
    setTimeout(() => {
      this.isUploading = false;
      this.uploadSuccess = true;
      this.selectedFile = null;
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.uploadSuccess = false;
      }, 3000);
    }, 2000);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private clearMessages(): void {
    this.uploadError = null;
    this.uploadSuccess = false;
  }
}
