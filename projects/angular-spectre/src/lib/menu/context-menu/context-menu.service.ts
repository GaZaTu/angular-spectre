import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Menu {
  template?: TemplateRef<any>
  links?: { text: string, href: string }[]
  pos: {
    pageX: number,
    pageY: number,
    target?: EventTarget | HTMLElement
    preventDefault?: () => any,
  }
  context?: any
  hidePrevious?: boolean
  anchor?: 'mouse' | 'target'
  style?: any
  adjustedStyle?: boolean
  sticky?: boolean
  hide?: () => any
}

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  menus = new BehaviorSubject<Set<Menu>>(new Set())

  show(menu: Menu) {
    if (menu.pos.preventDefault) {
      menu.pos.preventDefault()
    }

    const { pageX, pageY } = menu.pos
    const pos = { pageX, pageY }

    if (menu.anchor === 'target' && menu.pos.target) {
      const target = menu.pos.target as HTMLElement
      const targetRect = target.getBoundingClientRect()

      pos.pageX = (targetRect.left + window.scrollX) + (targetRect.width / 2)
      pos.pageY = (targetRect.top + window.scrollY) + (targetRect.height / 2)
    }

    if (menu.hidePrevious !== false) {
      if (menu.template) {
        this.menus.value.forEach(otherMenu => {
          if (otherMenu.template === menu.template) {
            this.menus.value.delete(otherMenu)
          }
        })
      } else if (menu.links) {
        this.menus.value.forEach(otherMenu => {
          if (otherMenu.links === menu.links) {
            this.menus.value.delete(otherMenu)
          }
        })
      }
    }

    setTimeout(() => {
      this.menus.value.add(menu)
      this.menus.next(this.menus.value)
    })

    menu.pos = pos
    menu.hide = () => this.hide(menu)

    return {
      hide: menu.hide,
    }
  }

  hide(menu: Menu) {
    this.menus.value.delete(menu)
    this.menus.next(this.menus.value)
  }

  clear() {
    this.menus.value.forEach(menu => {
      if (!menu.sticky) {
        this.menus.value.delete(menu)
      }
    })

    this.menus.next(this.menus.value)
  }
}
