// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, OnChanges, AfterContentInit, Input, Output, EventEmitter, HostBinding, Optional, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import classNames from 'classnames';
import { InputGroupService } from './input-group/input-group.service';
import { FormGroupService } from '../form-group/form-group.service';
import { FormService } from '../form.service';
import { Subscribe, ngModelProvider, NgModel } from '../../../utils';

// @dynamic
@Component({
  selector: 'spectre-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [ngModelProvider(InputComponent)],
})
export class InputComponent implements NgModel<string>, OnInit, OnDestroy, OnChanges, AfterContentInit {
  @Input()
  size?: 'sm' | 'md' | 'lg'
  @Input()
  icon?: string
  @Input()
  iconPos?: 'left' | 'right' = 'right'
  @Input()
  options?: string[]
  @Input()
  loading?: boolean
  @Input()
  success?: boolean
  @Input()
  error?: boolean
  @Input()
  formControlName?: string
  @Input()
  readOnly?: boolean

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`form-custom-input`]: true,
      [`has-icon-${this.iconPos}`]: this.icon || this.pending,
    }, this.class)
  }

  @Output()
  iconClick = new EventEmitter<MouseEvent>()

  // native props
  @Input()
  id?: string
  @Input()
  type?: string
  @Input()
  required = false
  @Input()
  pattern?: string
  @Input()
  placeholder?: string

  @ViewChild('input')
  input?: ElementRef<HTMLInputElement>

  value = ''
  disabled = false
  datalistId = Math.random().toString(36).substr(2, 10)

  _onChangeHandler?: (value: string) => any
  _onTouchedHandler?: () => any

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    @Optional() public inputGroup?: InputGroupService,
    @Optional() public formGroup?: FormGroupService,
    @Optional() public form?: FormService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() {
    if (this.formGroup && !this.formGroup.formControlName.value) {
      this.setState({ id: this.formGroup.id })
      this.formGroup.formControlName.next(this.formControlName)
    }
  }

  ngOnDestroy() {
    if (this.formGroup && this.formGroup.formControlName.value === this.formControlName) {
      this.formGroup.formControlName.next(undefined)
    }
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: InputComponent) => self.inputGroup && self.inputGroup.size)
  onInputGroupSizeChange(value: any) {
    this.setState({ size: value })
  }

  @Subscribe((self: InputComponent) => self.formGroup && self.formGroup.size)
  onFormGroupSizeChange(value: any) {
    this.setState({ size: value })
  }

  @Subscribe((self: InputComponent) => self.formGroup && self.formGroup.label)
  onFormGroupLabelChange(value: any) {
    this.setState({ placeholder: value })
  }

  @Subscribe((self: InputComponent) => self.control && self.control.statusChanges)
  onFormControlStatusChange() {
    this.setState({})
  }

  onChange(value: string) {
    this.setState({ value })

    if (this._onChangeHandler) {
      this._onChangeHandler(this.value)
    }

    if (this._onTouchedHandler) {
      this._onTouchedHandler()
    }
  }

  writeValue(value: string) {
    this.setState({ value })
    this.input.nativeElement.value = value
  }

  registerOnChange(handler: (value: string) => void) {
    this._onChangeHandler = handler
  }

  registerOnTouched(handler: () => void) {
    this._onTouchedHandler = handler
  }

  setDisabledState(isDisabled: boolean) {
    this.setState({ disabled: isDisabled })
  }

  setState(newState: Partial<InputComponent>) {
    Object.assign(this, newState)
    this.changeDetectorRef.detectChanges()
  }

  get inputClass() {
    return {
      [`form-input`]: true,
      [`input-${this.size}`]: this.size,
      [`is-success`]: this.success,
      [`is-error`]: this.error,
    }
  }

  get control() {
    if (this.form && this.formControlName) {
      const form = this.form.formGroup.value

      if (form) {
        return form.controls[this.formControlName]
      }
    }

    return undefined
  }

  get pending() {
    return (this.loading || (this.control && this.control.pending))
  }
}
