// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterContentInit, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef, ChangeDetectorRef, OnChanges, ContentChild } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { Subscribe } from '../../utils';
import { TabsActionDirective } from './tabs.directives';
import { ActivatedRoute, Router } from '@angular/router';

// @dynamic
@Component({
  selector: 'spectre-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit, OnDestroy, AfterContentInit, OnChanges {
  @Input()
  set activeTabKey(tabKey: string | undefined) {
    if (this.tabs) {
      this.switchToTabByKey(tabKey)
    } else {
      setTimeout(() => this.switchToTabByKey(tabKey))
    }
  }
  @Input()
  stretch?: boolean
  @Input()
  renderHiddenTabs?: boolean
  @Input()
  navOnly?: boolean

  @Output()
  activeTabKeyChange = new EventEmitter<string>()
  @Output()
  tabClose = new EventEmitter<string>()

  @ContentChildren(TabComponent, { descendants: false })
  tabs?: QueryList<TabComponent>

  @ContentChild(TabsActionDirective, { read: TemplateRef })
  tabAction?: TemplateRef<any>

  cacheId?: string
  activeTabComponent?: TabComponent

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterContentInit() {
    this.initCacheId()

    if (!this.activeTabComponent) {
      setTimeout(() => this.switchToTab(this.tabs.first))
    }

    this.onTabsChange()
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: TabsComponent) => self.tabs.changes, { getOn: 'ngAfterContentInit' })
  onTabsChange() {
    this.tabs.forEach(tab => {
      tab.active = (tab === this.activeTabComponent)
      tab.renderHiddenTabs = this.renderHiddenTabs
    })

    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: TabsComponent) => self.route.fragment, { getOn: 'ngAfterContentInit' })
  onRouteFragmentChange(fragment: string | null) {
    if (fragment) {
      this.tabs
        .filter(tab => tab.id === fragment)
        .forEach(tab => this.switchToTab(tab))
    }
  }

  tabIsActive(tab: TabComponent) {
    return (tab === this.activeTabComponent)
  }

  tabHasBadge(tab: TabComponent) {
    return (tab.badge !== undefined)
  }

  switchToTab(tab: TabComponent | undefined) {
    this.activeTabComponent = tab

    this.tabs.forEach(otherTab => {
      otherTab.active = (otherTab === this.activeTabComponent)
    })

    this.activeTabKeyChange.emit(this.activeTabComponent ? this.activeTabComponent.key : undefined)
    this.changeDetectorRef.detectChanges()
  }

  switchToTabByKey(tabKey: string | undefined) {
    const tabComponent = this.tabs.find(c => c.key === tabKey)

    if (tabComponent !== this.activeTabComponent) {
      this.switchToTab(tabComponent)
    }
  }

  closeTab(tab: TabComponent) {
    if (tab === this.activeTabComponent) {
      const tabsArray = this.tabs.toArray()
      const index = tabsArray.indexOf(tab)
      let newTab: TabComponent | undefined

      if (tabsArray.length > 1) {
        if (index === tabsArray.length - 1) {
          newTab = tabsArray[index - 1]
        } else {
          newTab = tabsArray[index + 1]
        }
      }

      this.switchToTab(newTab)
    }

    this.tabClose.emit(tab.key)
    this.changeDetectorRef.detectChanges()
  }

  initCacheId() {
    if (this.tabs) {
      this.cacheId = `tabs[${this.tabs.map(c => c.name).join('|')}]`
    }
  }

  trackTabFn(index: number, item: TabComponent) {
    return item.key
  }
}
