import { Component, OnChanges, AfterContentInit, Input, Optional, ChangeDetectorRef } from '@angular/core';
import { FormGroupService } from '../form-group/form-group.service';
import { NgModel, ngModelProvider } from '../../../utils';

@Component({
  selector: 'spectre-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [ngModelProvider(CheckboxComponent)],
})
export class CheckboxComponent implements NgModel<boolean>, OnChanges, AfterContentInit {
  @Input()
  size?: ''
  @Input()
  type?: 'checkbox' | 'radio' | 'switch' = 'checkbox'
  @Input()
  error?: boolean
  @Input()
  set formControlName(value: any) {
    if (this.formGroup) {
      this.formGroup.formControlName.next(value)
    }
  }

  // native props
  @Input()
  id?: string
  @Input()
  required = false

  checked = false
  disabled = false

  _onChangeHandler?: (value: boolean) => any
  _onTouchedHandler?: () => any

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    @Optional() public formGroup?: FormGroupService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  onChange(event: Event) {
    this.setState({ checked: (event.target as HTMLInputElement).checked })

    if (this._onChangeHandler) {
      this._onChangeHandler(this.checked)
    }

    if (this._onTouchedHandler) {
      this._onTouchedHandler()
    }
  }

  setState(newState: Partial<CheckboxComponent>) {
    Object.assign(this, newState)
    this.changeDetectorRef.detectChanges()
  }

  writeValue(value: boolean) {
    this.setState({ checked: value })
  }

  registerOnChange(handler: (value: boolean) => void) {
    this._onChangeHandler = handler
  }

  registerOnTouched(handler: () => void) {
    this._onTouchedHandler = handler
  }

  setDisabledState(isDisabled: boolean) {
    this.setState({ disabled: isDisabled })
  }

  get labelClass() {
    return {
      [`form-${this.type}`]: true,
      [`is-error`]: this.error,
    }
  }
}
