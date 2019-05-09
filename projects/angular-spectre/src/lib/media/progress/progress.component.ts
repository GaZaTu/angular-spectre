import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  @Input()
  value?: number
  @Input()
  max?: number
  @Input()
  unit?: string
  @Input()
  showTooltip?: boolean
  @Input()
  flat?: boolean
  @Input()
  loading?: boolean

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      flat: this.flat,
    }, this.class)
  }

  get progressClass() {
    return classNames({
      progress: true,
      tooltip: this.showTooltip && (this.value !== undefined || this.max !== undefined),
    })
  }

  get tooltip() {
    if (this.showTooltip) {
      return `${this.value}${this.unit ? ` ${this.unit}` : ''}${this.max ? ` / ${this.max}${this.unit ? ` ${this.unit}` : ''}` : ''}`
    } else {
      return undefined
    }
  }

  get actualValue() {
    if (this.value) {
      return this.value
    } else if (this.loading) {
      return undefined
    } else {
      return 0
    }
  }

  get actualMax() {
    if (this.max) {
      return this.max
    } else if (this.loading) {
      return undefined
    } else {
      return 0
    }
  }
}
