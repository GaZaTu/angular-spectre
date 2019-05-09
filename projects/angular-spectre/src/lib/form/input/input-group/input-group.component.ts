// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterContentInit, Input, ContentChildren, QueryList, ElementRef, HostBinding, Optional, ChangeDetectorRef } from '@angular/core';
import classNames from 'classnames';
import { InputGroupService } from './input-group.service';
import { FormGroupService } from '../../form-group/form-group.service';
import { InputGroupAddonDirective } from './input-group.directives';
import { Subscribe } from '../../../../utils';

// @dynamic
@Component({
  selector: 'spectre-input-group',
  templateUrl: './input-group.component.html',
  styleUrls: ['./input-group.component.scss'],
  providers: [InputGroupService],
})
export class InputGroupComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input()
  set size(value: 'sm' | 'md' | 'lg') {
    this.service.size.next(value)
  }

  @ContentChildren(InputGroupAddonDirective, { read: ElementRef })
  childSpans: QueryList<ElementRef>

  @Input()
  class?: any
  @HostBinding('class')
  get hostClass() {
    return classNames('input-group', this.class)
  }

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public service: InputGroupService,
    @Optional() public formGroup?: FormGroupService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: InputGroupComponent) => self.service.size, { getOn: 'ngAfterContentInit' })
  onSizeChange() {
    this.modifyChildSpans()
  }

  @Subscribe((self: InputGroupComponent) => self.formGroup && self.formGroup.size)
  onFormGroupSizeChange(value: any) {
    this.service.size.next(value)
  }

  @Subscribe((self: InputGroupComponent) => self.childSpans.changes, { getOn: 'ngAfterContentInit' })
  onChildSpansChange() {
    this.modifyChildSpans()
  }

  modifyChildSpans() {
    this.childSpans.forEach(child => {
      child.nativeElement.className = classNames({
        [`input-group-addon`]: true,
        [`addon-${this.service.size.value}`]: this.service.size.value,
      }, child.nativeElement.className)
    })

    this.changeDetectorRef.detectChanges()
  }
}
