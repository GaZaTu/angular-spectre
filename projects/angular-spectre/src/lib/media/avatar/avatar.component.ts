import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input()
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  @Input()
  initials?: string
  @Input()
  image?: string
  @Input()
  icon?: string
  @Input()
  presence?: 'offline' | 'online' | 'busy' | 'away'

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`avatar`]: true,
      [`avatar-${this.size}`]: this.size,
    }, this.class)
  }

  @HostBinding('attr.data-initial')
  get hostDataInitial() {
    return this.initials
  }
}
