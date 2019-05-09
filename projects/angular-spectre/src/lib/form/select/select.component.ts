// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, OnChanges, AfterContentInit, Input, HostBinding, ContentChildren, QueryList, Optional, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { OptionComponent } from './option/option.component';
import classNames from 'classnames';
import { InputGroupService } from '../input/input-group/input-group.service';
import { FormGroupService } from '../form-group/form-group.service';
import { ngModelProvider, NgModel, Subscribe } from '../../../utils';

// @dynamic
@Component({
  selector: 'spectre-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [ngModelProvider(SelectComponent)],
})
export class SelectComponent<T = any> implements NgModel<T>, OnInit, OnDestroy, OnChanges, AfterContentInit {
  @Input()
  size?: 'sm' | 'md' | 'lg'
  @Input()
  success?: boolean
  @Input()
  error?: boolean
  @Input()
  formControlName?: string

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`form-custom-input`]: true,
    }, this.class)
  }

  @ContentChildren(OptionComponent)
  options?: QueryList<OptionComponent>

  // native props
  @Input()
  id?: string
  @Input()
  required = false

  @ViewChild('select')
  select?: ElementRef<HTMLInputElement>

  key = undefined as string | undefined
  value = undefined as T | undefined
  disabled = false

  _onChangeHandler?: (value: T) => any
  _onTouchedHandler?: () => any

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    @Optional() public inputGroup?: InputGroupService,
    @Optional() public formGroup?: FormGroupService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() {
    if (this.formGroup && !this.formGroup.formControlName.value) {
      this.id = this.formGroup.id
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
    this.updateKeyByValue()
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: SelectComponent) => self.inputGroup && self.inputGroup.size)
  onInputGroupSizeChange(value: any) {
    this.setState({ size: value })
  }

  @Subscribe((self: SelectComponent) => self.formGroup && self.formGroup.size)
  onFormGroupSizeChange(value: any) {
    this.setState({ size: value })
  }

  @Subscribe((self: SelectComponent) => self.options.changes, { getOn: 'ngAfterContentInit' })
  onOptionsChange() {
    this.changeDetectorRef.detectChanges()
  }

  onChange(event: Event) {
    this.setState({ key: (event.target as HTMLSelectElement).value })
    this.updateValueByKey()

    if (this._onChangeHandler) {
      this._onChangeHandler(this.value)
    }

    if (this._onTouchedHandler) {
      this._onTouchedHandler()
    }
  }

  setState(newState: Partial<SelectComponent>) {
    Object.assign(this, newState)
    this.changeDetectorRef.detectChanges()
  }

  writeValue(value: T) {
    this.setState({ value })
    this.updateKeyByValue()
    this.select.nativeElement.value = this.key
    this.changeDetectorRef.detectChanges()
  }

  registerOnChange(handler: (value: T) => void) {
    this._onChangeHandler = handler
  }

  registerOnTouched(handler: () => void) {
    this._onTouchedHandler = handler
  }

  setDisabledState(isDisabled: boolean) {
    this.setState({ disabled: isDisabled })
  }

  updateValueByKey() {
    if (this.options) {
      this.options
        .filter(o => o.key === this.key)
        .forEach(o => {
          this.value = o.value
        })
    }

    this.changeDetectorRef.detectChanges()
  }

  updateKeyByValue() {
    if (this.options) {
      this.options
        .filter(o => o.value === this.value)
        .forEach(o => {
          this.key = o.key
        })
    }

    this.changeDetectorRef.detectChanges()
  }

  trackOptionFn(index: number, item: OptionComponent) {
    return item.key
  }

  get selectClass() {
    return {
      [`form-select`]: true,
      [`select-${this.size}`]: this.size,
      [`is-success`]: this.success,
      [`is-error`]: this.error,
    }
  }
}
