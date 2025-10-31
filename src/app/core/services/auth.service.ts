import { Injectable, Inject } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  User,
  Auth,
} from 'firebase/auth';
import { TranslateService } from '@ngx-translate/core';
import { FIREBASE_AUTH } from './firebase.providers';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(@Inject(FIREBASE_AUTH) private auth: Auth, private translate: TranslateService) {
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

  getCurrentUid(): string | null {
    return this.currentUser?.uid || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Send sign-in link to email
   */
  async sendSignInLinkToEmail(email: string, adminUid: string): Promise<void> {
    try {
      //TODO: change the url to the correct url
      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: `${environment.webAppUrl}/auth/finish-signin?adminUid=${encodeURIComponent(adminUid)}&email=${encodeURIComponent(email)}`,
        // This must be true.
        handleCodeInApp: true,
        iOS: {
          bundleId: environment.iosBundleId,
        },
        android: {
          packageName: environment.androidPackageName,
          installApp: true,
          minimumVersion: '1',
        },
      };

      await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);


    } catch (error: any) {
      console.error('Error sending sign-in link:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handle authentication errors and return user-friendly messages
   */
  private handleAuthError(error: any): Error {
    let message = this.translate.instant('app.auth.login.error.auth');

    switch (error.code) {
      case 'auth/too-many-requests':
        message = this.translate.instant('app.auth.login.error.tooManyRequests');
        break;
      case 'auth/invalid-credential':
        message = this.translate.instant('app.auth.login.error.invalidCredentials');
        break;
      default:
        console.error('Error de autenticación:', error.message);
        message = this.translate.instant('app.auth.login.error.auth');
    }

    return new Error(message);
  }
}
