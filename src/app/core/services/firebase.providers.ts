// Simple Firebase configuration for Auth only
import { InjectionToken } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { FirebaseConfigService } from './firebase-config.service';

// Injection tokens for Firebase services
export const FIREBASE_APP = new InjectionToken<FirebaseApp>('firebase.app');
export const FIREBASE_AUTH = new InjectionToken<Auth>('firebase.auth');

/**
 * Provide Firebase App instance
 */
export function provideFirebaseApp() {
  return {
    provide: FIREBASE_APP,
    useFactory: () => {
      const configService = new FirebaseConfigService();
      const config = configService.getConfig();
      return initializeApp(config);
    }
  };
}

/**
 * Provide Firebase Auth instance
 */
export function provideFirebaseAuth() {
  return {
    provide: FIREBASE_AUTH,
    useFactory: (app: FirebaseApp) => {
      return getAuth(app);
    },
    deps: [FIREBASE_APP]
  };
}
