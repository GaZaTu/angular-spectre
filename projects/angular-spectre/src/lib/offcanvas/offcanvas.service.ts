import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class OffcanvasService {
  sidebarVisibility = new BehaviorSubject<'show' | 'hide' | 'auto'>('auto')
  contentPadding = new BehaviorSubject<boolean>(false)

  toggleSidebar() {
    if (this.sidebarVisibility.value === 'show') {
      this.sidebarVisibility.next('auto')
    } else if (this.sidebarVisibility.value === 'hide') {
      this.sidebarVisibility.next('show')
    } else {
      this.sidebarVisibility.next('show')
    }
  }

  forceToggleSidebar() {
    if (this.sidebarVisibility.value === 'show') {
      this.sidebarVisibility.next('hide')
    } else if (this.sidebarVisibility.value === 'hide') {
      this.sidebarVisibility.next('show')
    } else {
      if (window.innerWidth > 960) {
        this.sidebarVisibility.next('hide')
      } else {
        this.sidebarVisibility.next('show')
      }
    }
  }

  toggleContentPadding() {
    this.contentPadding.next(!this.contentPadding.value)
  }

  get sidebarVisibilityClassName() {
    if (this.sidebarVisibility.value === 'show') {
      return 'active'
    } else if (this.sidebarVisibility.value === 'hide') {
      return 'd-hide'
    } else {
      return ''
    }
  }

  get isSidebarVisible() {
    if (this.sidebarVisibility.value === 'show') {
      return true
    } else if (this.sidebarVisibility.value === 'hide') {
      return false
    } else {
      return (window.innerWidth > 960)
    }
  }

  get isContentPadded() {
    return this.contentPadding.value
  }
}
