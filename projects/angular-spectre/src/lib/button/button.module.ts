import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from '../form';
import { ButtonDirective } from './button.directive';
import { ButtonGroupComponent } from './button-group/button-group.component';

@NgModule({
  declarations: [
    ButtonDirective,
    ButtonGroupComponent,
  ],
  imports: [
    CommonModule,
    FormModule,
  ],
  exports: [
    ButtonDirective,
    ButtonGroupComponent,
  ],
})
export class ButtonModule { }
