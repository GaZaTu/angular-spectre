import { Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  @Input()
  avatarImage?: string
  @Input()
  avatarInitials?: string
  @Input()
  avatarStyle?: any

  @Output()
  close = new EventEmitter<MouseEvent>()

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`chip`]: true,
    }, this.class)
  }
}
