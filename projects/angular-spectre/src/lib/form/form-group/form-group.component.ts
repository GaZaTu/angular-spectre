// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, Input, HostBinding, Output, EventEmitter, Optional, ContentChild, TemplateRef, OnChanges, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import classNames from 'classnames';
import { AbstractControl } from '@angular/forms';
import { FormGroupService } from './form-group.service';
import { FormService } from '../form.service';
import { FormGroupLabelDirective } from './form-group.directives';
import { Subscribe } from '../../../utils';
import { ConfigService } from '../../config';

// @dynamic
@Component({
  selector: 'spectre-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
  providers: [FormGroupService],
})
export class FormGroupComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
  @Input()
  set size(value: 'sm' | 'md' | 'lg') {
    this.service.size.next(value)
  }
  get size() {
    return this.service.size.value
  }
  @Input()
  label?: string
  @Input()
  hint?: string
  @Input()
  success?: boolean
  @Input()
  error?: boolean
  @Input()
  horizontal?: boolean
  @Input()
  horizontalManually?: boolean
  @Input()
  labelClass?: string
  @Input()
  connectLabelWithControl = true

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames(this.control ? {
      'form-group': true,
      'has-success': this.success,
      'has-error': this.control.invalid && (this.control.dirty || this.control.touched),
      'has-required': this.controlIsRequired,
    } : {
      'form-group': true,
      'has-success': this.success,
      'has-error': this.error,
    }, this.class)
  }

  @Output()
  labelClick = new EventEmitter<MouseEvent>()

  @ContentChild(FormGroupLabelDirective, { read: TemplateRef })
  labelTemplate?: TemplateRef<any>

  cachedControl?: AbstractControl

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public service: FormGroupService,
    public configService: ConfigService,
    @Optional() public form: FormService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: FormGroupComponent) => self.form && self.form.size)
  onFormSizeChange(value: any) {
    this.service.size.next(value)
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: FormGroupComponent) => self.form && self.form.horizontal)
  onFormHorizontalChange(value: any) {
    this.horizontal = value
    this.changeDetectorRef.detectChanges()
  }

  get hintValue() {
    if (this.control && this.control.errors && (this.control.dirty || this.control.touched)) {
      return this.configService.get(`errors.${Object.keys(this.control.errors)[0]}`)
    } else {
      return this.hint
    }
  }

  get control() {
    if (!this.cachedControl) {
      if (this.form) {
        const formGroup = this.form.formGroup.value
        const formControlName = this.service.formControlName.value

        if (formGroup && formControlName) {
          this.cachedControl = formGroup.controls[formControlName]
        }
      }
    }

    return this.cachedControl
  }

  get controlIsRequired() {
    return (this.control && this.control.validator && this.control.validator({} as any))
  }

  get controlId() {
    if (this.connectLabelWithControl) {
      return this.service && this.service.id
    } else {
      return undefined
    }
  }
}
