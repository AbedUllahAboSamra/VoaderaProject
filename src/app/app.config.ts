import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';

import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';

import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { TranslateModule } from '@ngx-translate/core';

import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    provideAnimations(),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      }),
    ),

    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'en',
        loader: provideTranslateHttpLoader({
          prefix: './assets/i18n/',
          suffix: '.json',
          useHttpBackend: true,
        }),
      }),
    ),
  ],
};
