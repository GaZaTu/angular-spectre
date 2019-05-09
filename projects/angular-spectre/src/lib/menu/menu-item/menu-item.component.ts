import { Component, Input, HostBinding, ContentChild, TemplateRef } from '@angular/core';
import classNames from 'classnames';
import { MenuItemBadgeDirective } from './menu-item.directives';

@Component({
  selector: 'spectre-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent {
  @Input()
  menuBadgeLabel?: string
  @Input()
  menuBadgeLabelKind?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames('menu-item', this.class)
  }

  @ContentChild(MenuItemBadgeDirective, { read: TemplateRef })
  menuBadge?: TemplateRef<any>
}
