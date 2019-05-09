import { Component, Input, HostBinding, ViewChild, TemplateRef } from '@angular/core';
import classNames from 'classnames';

@Component({
  selector: 'spectre-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @Input()
  key: string
  @Input()
  name = this.key
  @Input()
  closable?: boolean
  @Input()
  badge?: string

  @Input()
  active = false
  @Input()
  renderHiddenTabs = false

  @Input()
  class?: any
  // @HostBinding('class')
  get hostClass() {
    return classNames({
      'tab-page': true,
      'd-hide': this.renderHiddenTabs && !this.active,
    }, this.class)
  }

  // @HostBinding('id')
  get id() {
    return `tab:${this.key}`
  }

  @ViewChild('content')
  content: TemplateRef<any>
}
