import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { InputComponent } from './input/input.component';
import { InputGroupComponent } from './input/input-group/input-group.component';
import { SelectComponent } from './select/select.component';
import { OptionComponent } from './select/option/option.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { FormGroupLabelDirective } from './form-group/form-group.directives';
import { InputGroupAddonDirective } from './input/input-group/input-group.directives';

@NgModule({
  declarations: [
    FormComponent,
    FormGroupComponent,
    CheckboxComponent,
    InputComponent,
    InputGroupComponent,
    SelectComponent,
    OptionComponent,
    RadioGroupComponent,
    FormGroupLabelDirective,
    InputGroupAddonDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    FormComponent,
    FormGroupComponent,
    CheckboxComponent,
    InputComponent,
    InputGroupComponent,
    SelectComponent,
    OptionComponent,
    RadioGroupComponent,
    FormGroupLabelDirective,
    InputGroupAddonDirective,
  ],
})
export class FormModule { }
