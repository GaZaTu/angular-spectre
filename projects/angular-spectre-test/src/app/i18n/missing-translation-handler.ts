import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';

export class AppMissingTranslationHandler implements MissingTranslationHandler {
  constructor(
    public api: ApiService,
  ) { }

  handle(params: MissingTranslationHandlerParams) {
    if (!environment.production) {
      console.warn('translation.missing:', params.key)
    }

    return params.key
  }
}

export function provideAppMissingTranslationHandler() {
  return {
    provide: MissingTranslationHandler,
    useClass: AppMissingTranslationHandler,
    deps: [ApiService],
  }
}
