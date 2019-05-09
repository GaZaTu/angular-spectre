import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// tslint:disable-next-line:max-line-length
import { ButtonModule, MediaModule, FormModule, ModalModule, ToastModule, TabsModule, MenuModule, AutocompleteModule, TableModule, CalendarModule, PanelModule, OffcanvasModule, KanbanModule } from 'angular-spectre';

import { AppRoutingModule } from './app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { provideAppTranslateLoader } from './i18n/translate-loader';
import { provideAppTranslateCompiler } from './i18n/translate-compiler';
import { provideAppMissingTranslationHandler } from './i18n/missing-translation-handler';
import { AppLibModule } from './app-lib.module';
import { SpectreTableColumnPresetsComponent } from './components/spectre-table-column-presets/spectre-table-column-presets.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export function jwtGetter() {
  return AuthService.token
}

@NgModule({
  declarations: [
    AppComponent,
    SpectreTableColumnPresetsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtGetter,
      },
    }),
    TranslateModule.forRoot({
      loader: provideAppTranslateLoader(),
      compiler: provideAppTranslateCompiler(),
      missingTranslationHandler: provideAppMissingTranslationHandler(),
      useDefaultLang: false,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    AppRoutingModule,
    ButtonModule,
    MediaModule,
    FormModule,
    ModalModule,
    ToastModule,
    TabsModule,
    MenuModule,
    AutocompleteModule,
    TableModule,
    CalendarModule,
    OffcanvasModule,
    PanelModule,
    KanbanModule,
    AppLibModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
