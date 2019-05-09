import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent {
  @Input()
  xxl?: string
  @Input()
  xl?: string
  @Input()
  lg?: string
  @Input()
  md?: string
  @Input()
  sm?: string
  @Input()
  xs?: string
  @Input()
  show?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  @Input()
  hide?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  @Input()
  autoAlign?: 'left' | 'center' | 'right'

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`column`]: true,
      [`col-${this.xxl}`]: this.xxl,
      [`col-xl-${this.xl}`]: this.xl,
      [`col-lg-${this.lg}`]: this.lg,
      [`col-md-${this.md}`]: this.md,
      [`col-sm-${this.sm}`]: this.sm,
      [`col-xs-${this.xs}`]: this.xs,
      [`show-${this.show}`]: this.show,
      [`hide-${this.hide}`]: this.hide,
      [`col-${this.offsetKey}-auto`]: this.autoAlign,
    }, this.class)
  }

  get offsetKey() {
    if (this.autoAlign === 'left') {
      return 'mr'
    } else if (this.autoAlign === 'center') {
      return 'mx'
    } else if (this.autoAlign === 'right') {
      return 'ml'
    } else {
      return null
    }
  }
}
