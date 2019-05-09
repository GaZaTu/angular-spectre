import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
  @Input()
  text?: string
  @Input()
  vertical?: boolean
  @Input()
  textAlign?: string

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`divider`]: !this.vertical,
      [`divider-vert`]: this.vertical,
      [`text-${this.textAlign}`]: this.textAlign && !this.vertical,
    }, this.class)
  }

  @HostBinding('attr.data-content')
  get hostDataContent() {
    return this.text
  }
}
