import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeEsCol from '@angular/common/locales/es-CO';

registerLocaleData(localeEsCol);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
