// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, OnChanges, AfterContentInit, Input, ChangeDetectorRef, Optional, HostBinding, ContentChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { AccordionGroupService } from './accordion-group/accordion-group.service';
import { Subscribe } from '../../utils';
import classNames from 'classnames';
import { AccordionHeaderDirective, AccordionBodyDirective } from './accordion.directives';

// @dynamic
@Component({
  selector: 'spectre-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
  @Input()
  name?: string
  @Input()
  open?: boolean
  @Input()
  exclusive?: boolean
  @Input()
  showIcon?: boolean
  @Input()
  alwaysRender?: boolean

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames({
      [`accordion`]: true,
    }, this.class)
  }

  @Output()
  openChange = new EventEmitter<boolean>()

  @ContentChild(AccordionHeaderDirective, { read: TemplateRef })
  headerTemplate?: TemplateRef<any>
  @ContentChild(AccordionBodyDirective, { read: TemplateRef })
  bodyTemplate?: TemplateRef<any>

  id = Math.random().toString(36).substr(2, 10)

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    @Optional() public accordionGroupService?: AccordionGroupService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: AccordionComponent) => self.accordionGroupService && self.accordionGroupService.exclusive)
  @Subscribe((self: AccordionComponent) => self.accordionGroupService && self.accordionGroupService.showIcon)
  @Subscribe((self: AccordionComponent) => self.accordionGroupService && self.accordionGroupService.alwaysRender)
  onAccordionGroupServiceChange() {
    this.changeDetectorRef.detectChanges()
  }

  getName() {
    if (this.exclusive) {
      if (this.accordionGroupService) {
        return this.accordionGroupService.name
      } else {
        return this.name
      }
    } else {
      return undefined
    }
  }

  getExclusive() {
    if (this.accordionGroupService) {
      return this.accordionGroupService.exclusive.value
    } else {
      return this.exclusive
    }
  }

  getShowIcon() {
    if (this.accordionGroupService) {
      return this.accordionGroupService.showIcon.value
    } else {
      return this.showIcon
    }
  }

  getAlwaysRender() {
    if (this.accordionGroupService) {
      return this.accordionGroupService.alwaysRender.value
    } else {
      return this.alwaysRender
    }
  }

  onChange(event: Event) {
    this.openChange.emit((event.target as HTMLInputElement).checked)
  }

  get attrChecked() {
    return this.openChange.observers.length ? this.open : undefined
  }

  get checked() {
    return !this.openChange.observers.length ? this.open : undefined
  }
}
