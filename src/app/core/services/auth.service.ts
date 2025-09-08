import { Injectable, Inject } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase.providers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(@Inject(FIREBASE_AUTH) private auth: Auth) {
    // Listen to authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  /**
   * Sign in with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }


  /**
   * Sign out user
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Handle authentication errors and return user-friendly messages
   */
  private handleAuthError(error: any): Error {
    let message = 'Error de autenticación';

    switch (error.code) {
      case 'auth/too-many-requests':
        message = 'Demasiados intentos fallidos. Intenta nuevamente más tarde';
        break;
      case 'auth/invalid-credential':
        message = 'Credenciales inválidas';
        break;
      default:
        console.error('Error de autenticación:', error.message);
        message = 'Error de autenticación';
    }

    return new Error(message);
  }
}
