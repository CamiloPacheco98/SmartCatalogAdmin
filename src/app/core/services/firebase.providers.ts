// Firebase configuration for Auth, Storage, and Firestore
import { InjectionToken } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FirebaseConfigService } from './firebase-config.service';

// Injection tokens for Firebase services
export const FIREBASE_APP = new InjectionToken<FirebaseApp>('firebase.app');
export const FIREBASE_AUTH = new InjectionToken<Auth>('firebase.auth');
export const FIREBASE_STORAGE = new InjectionToken<FirebaseStorage>('firebase.storage');
export const FIREBASE_FIRESTORE = new InjectionToken<Firestore>('firebase.firestore');

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

/**
 * Provide Firebase Storage instance
 */
export function provideFirebaseStorage() {
  return {
    provide: FIREBASE_STORAGE,
    useFactory: (app: FirebaseApp) => {
      return getStorage(app);
    },
    deps: [FIREBASE_APP]
  };
}

/**
 * Provide Firebase Firestore instance
 */
export function provideFirebaseFirestore() {
  return {
    provide: FIREBASE_FIRESTORE,
    useFactory: (app: FirebaseApp) => {
      return getFirestore(app);
    },
    deps: [FIREBASE_APP]
  };
}
