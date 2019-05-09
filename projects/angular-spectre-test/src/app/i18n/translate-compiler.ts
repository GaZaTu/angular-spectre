import { TranslateCompiler } from '@ngx-translate/core';
import { ApiService } from '../services/api.service';

export class AppTranslateCompiler implements TranslateCompiler {
  constructor(
    public api: ApiService,
  ) { }

  compile(value: string, lang: string) {
    return value
  }

  compileTranslations(translations: any, lang: string) {
    for (const [key, value] of Object.entries(translations)) {
      if (typeof value === 'object') {
        translations[key] = this.compileTranslations(value, lang)
      } else if (typeof value === 'string') {
        translations[key] = this.compile(value, lang)
      }
    }

    return translations
  }
}

export function provideAppTranslateCompiler() {
  return {
    provide: TranslateCompiler,
    useClass: AppTranslateCompiler,
    deps: [ApiService],
  }
}
