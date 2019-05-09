import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ContextMenuDirective } from './context-menu/context-menu.directive';
import { MenuItemBadgeDirective } from './menu-item/menu-item.directives';

@NgModule({
  declarations: [
    MenuComponent,
    MenuItemComponent,
    ContextMenuComponent,
    ContextMenuDirective,
    MenuItemBadgeDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MenuComponent,
    MenuItemComponent,
    ContextMenuComponent,
    ContextMenuDirective,
    MenuItemBadgeDirective,
  ],
})
export class MenuModule { }
