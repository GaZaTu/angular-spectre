import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsComponent {
  @Input()
  gapless?: boolean
  @Input()
  oneLine?: boolean

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`columns`]: true,
      [`col-gapless`]: this.gapless,
      [`col-oneline`]: this.oneLine,
    }, this.class)
  }
}
