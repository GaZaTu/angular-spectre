import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import { ContextMenuService, Menu } from './context-menu.service';
import { Subscribe } from '../../../utils';

// @dynamic
@Component({
  selector: 'spectre-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContextMenuComponent implements OnInit, OnDestroy {
  @Input()
  detachCdr = false

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public service: ContextMenuService,
  ) { }

  ngOnInit() {
    if (this.detachCdr) {
      this.changeDetectorRef.detach()
    }
  }

  ngOnDestroy() { }

  @Subscribe((self: ContextMenuComponent) => self.service.menus)
  onMenusChange() {
    this.changeDetectorRef.detectChanges()
  }

  getMenuStyle(menu: Menu, idx: number, el: HTMLElement) {
    if (!menu.adjustedStyle) {
      menu.adjustedStyle = true
      menu.style = {
        position: 'absolute',
        visibility: 'hidden',
        'left.px': menu.pos.pageX,
        'top.px': menu.pos.pageY,
        'z-index': 300 + idx,
      }

      setTimeout(() => {
        const menuRect = el.getBoundingClientRect()
        const menuStyle = Object.assign(menu.style, {
          visibility: 'visible',
        })

        if (menuRect.right > window.outerWidth) {
          menuStyle['left.px'] = (menuRect.left + window.scrollX) - menuRect.width

          if (menuStyle['left.px'] < 0) {
            throw new Error(`ContextMenu is too big for a window.outerWidth of '${window.outerWidth}'`)
          }
        }

        if (menuRect.bottom > window.innerHeight) {
          menuStyle['top.px'] = (menuRect.top + window.scrollY) - menuRect.height

          if (menuStyle['top.px'] < 0) {
            throw new Error(`ContextMenu is too big for a window.innerHeight of '${window.innerHeight}'`)
          }
        }

        this.changeDetectorRef.detectChanges()
      })
    }

    return menu.style
  }

  onMenuClick(menu: Menu, ev: MouseEvent) {
    ev.stopPropagation()
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.service.clear()
  }

  @HostListener('document:contextmenu')
  onDocumentContextMenu() {
    this.service.clear()
  }
}
