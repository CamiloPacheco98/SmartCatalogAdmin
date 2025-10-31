import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, provideFirebaseAuth, provideFirebaseStorage, provideFirebaseFirestore } from './core/services/firebase.providers';
import {provideTranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
  
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix:'./i18n/', suffix:'.json'}),
      fallbackLang: 'es'
    }),
    // Firebase initialization
    provideFirebaseApp(),
    provideFirebaseAuth(),
    provideFirebaseStorage(),
    provideFirebaseFirestore()
  ]
};
