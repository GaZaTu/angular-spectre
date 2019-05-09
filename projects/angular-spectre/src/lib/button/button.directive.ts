import { Directive, ElementRef, Input, HostBinding, Optional, OnInit, OnDestroy } from '@angular/core';
import classNames from 'classnames';
import { InputGroupService } from '../form/input/input-group/input-group.service';
import { FormService } from '../form/form.service';
import { Subscribe } from '../../utils';

// @dynamic
@Directive({
  selector: '[spectreButton]',
})
export class ButtonDirective implements OnInit, OnDestroy {
  @Input('spectreButton')
  kind?: 'default' | 'primary' | 'link' | 'success' | 'error'
  @Input()
  size?: 'sm' | 'md' | 'lg' | 'block'
  @Input()
  shape?: 'square' | 'circle'
  @Input()
  loading?: boolean
  @Input()
  disabled?: boolean
  @Input()
  type?: string
  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`btn`]: true,
      [`btn-${this.kind}`]: this.kind,
      [`btn-${this.size}`]: this.size,
      [`btn-action`]: this.shape,
      [`s-circle`]: this.shape === 'circle',
      [`loading`]: this.loading,
      [`disabled`]: this.disabled || !this.canSubmit,
    }, this.class)
  }

  constructor(
    public ref: ElementRef<HTMLElement>,
    @Optional() public inputGroup?: InputGroupService,
    @Optional() public form?: FormService,
  ) { }

  ngOnInit() {
    if (this.inputGroup) {
      this.class = classNames(this.class, 'input-group-btn')
    }
  }

  ngOnDestroy() { }

  @Subscribe((self: ButtonDirective) => self.inputGroup && self.inputGroup.size)
  onInputGroupSizeChange(value: any) {
    this.size = value
  }

  get canSubmit() {
    if (this.type === 'submit') {
      const form = this.form.formGroup.value

      if (form) {
        return (!form.disabled && !form.pending && form.valid)
      } else {
        return false
      }
    } else {
      return true
    }
  }

  get native() {
    return this.ref.nativeElement
  }
}
