import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  @Input()
  kind?: '' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  @Input()
  round?: boolean

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`label`]: true,
      [`label-${this.kind}`]: this.kind,
      [`label-rounded`]: this.round,
    }, this.class)
  }
}
