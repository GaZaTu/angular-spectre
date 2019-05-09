import { Component, Input, HostBinding } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input()
  nav?: boolean

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      menu: true,
      'menu-nav': this.nav,
    }, this.class)
  }
}
