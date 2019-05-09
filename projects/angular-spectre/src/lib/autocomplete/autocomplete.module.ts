import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from '../menu';
import { AutocompleteComponent } from './autocomplete.component';
// container directives
import { AutocompleteOptionDirective } from './autocomplete.directives';

@NgModule({
  declarations: [
    AutocompleteComponent,
    // container directives
    AutocompleteOptionDirective,
  ],
  imports: [
    CommonModule,
    MenuModule,
  ],
  exports: [
    AutocompleteComponent,
    // container directives
    AutocompleteOptionDirective,
  ],
})
export class AutocompleteModule { }
