import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, provideFirebaseAuth, provideFirebaseStorage, provideFirebaseFirestore } from './core/services/firebase.providers';
  
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Firebase initialization
    provideFirebaseApp(),
    provideFirebaseAuth(),
    provideFirebaseStorage(),
    provideFirebaseFirestore()
  ]
};
