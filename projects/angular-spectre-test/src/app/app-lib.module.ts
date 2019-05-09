import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { FaIconDirective } from './directives/fa-icon/fa-icon.directive';
import { HasPermissionsDirective } from './directives/has-permissions.directive';
import { IsAuthenticatedDirective } from './directives/is-authenticated.directive';
import { HttpClientModule } from '@angular/common/http';
import { StickyTitleDirective } from './directives/sticky-title/sticky-title.directive';
import { MediaModule } from 'angular-spectre';

@NgModule({
  declarations: [
    FaIconDirective,
    HasPermissionsDirective,
    IsAuthenticatedDirective,
    StickyTitleDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MediaModule,
  ],
  exports: [
    FaIconDirective,
    HasPermissionsDirective,
    IsAuthenticatedDirective,
    StickyTitleDirective,
  ],
})
export class AppLibModule { }
