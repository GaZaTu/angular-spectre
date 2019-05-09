// tslint:disable-next-line:max-line-length
import { Component, OnChanges, AfterContentInit, Input, ContentChildren, QueryList, Optional, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { OptionComponent } from '../select/option/option.component';
import { FormGroupService } from '../form-group/form-group.service';
import { ngModelProvider, NgModel, Subscribe } from '../../../utils';

@Component({
  selector: 'spectre-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  providers: [ngModelProvider(RadioGroupComponent)],
})
export class RadioGroupComponent<T = any> implements NgModel<T>, OnInit, OnDestroy, OnChanges, AfterContentInit {
  @Input()
  error?: boolean
  @Input()
  required = false
  @Input()
  set formControlName(value: any) {
    if (this.formGroup) {
      this.formGroup.formControlName.next(value)
    }
  }

  @ContentChildren(OptionComponent)
  options: QueryList<OptionComponent>

  key = undefined as string | undefined
  value = undefined as T | undefined
  disabled = false

  _onChangeHandler?: (value: T) => any
  _onTouchedHandler?: () => any

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    @Optional() public formGroup?: FormGroupService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.updateKeyByValue()
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: RadioGroupComponent) => self.options.changes, { getOn: 'ngAfterContentInit' })
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

  setState(newState: Partial<RadioGroupComponent>) {
    Object.assign(this, newState)
    this.changeDetectorRef.detectChanges()
  }

  writeValue(value: T) {
    this.setState({ value })
    this.updateKeyByValue()
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

  isOptionChecked(option: OptionComponent) {
    return (option.key === this.key)
  }

  onOptionChecked(option: OptionComponent, checked: boolean) {
    if (checked) {
      this.setState({ key: option.key })
    }
  }

  trackOptionFn(index: number, item: OptionComponent) {
    return item.key
  }
}
