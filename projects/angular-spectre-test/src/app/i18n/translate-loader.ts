import { TranslateLoader } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { ApiService } from '../services/api.service';

export class AppTranslateLoader implements TranslateLoader {
  constructor(
    public api: ApiService,
  ) { }

  getTranslation(lang: string) {
    // return this.api.get(`/i18n/translations/${lang}.json`)

    return observableOf(
      JSON.parse(
        `
        {
          "test": "Test translation",
          "user": {
            "profile": "Profil"
          }
        }
        `
      )
    )
  }
}

export function provideAppTranslateLoader() {
  return {
    provide: TranslateLoader,
    useClass: AppTranslateLoader,
    deps: [ApiService],
  }
}
