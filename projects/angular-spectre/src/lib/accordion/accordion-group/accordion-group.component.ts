import { Component, OnInit, OnChanges, AfterContentInit, Input, ChangeDetectorRef } from '@angular/core';
import { AccordionGroupService } from './accordion-group.service';

@Component({
  selector: 'spectre-accordion-group',
  templateUrl: './accordion-group.component.html',
  styleUrls: ['./accordion-group.component.scss'],
  providers: [AccordionGroupService],
})
export class AccordionGroupComponent implements OnInit, OnChanges, AfterContentInit {
  @Input()
  exclusive?: boolean
  @Input()
  showIcon?: boolean
  @Input()
  alwaysRender?: boolean

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public service: AccordionGroupService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnChanges() {
    this.service.exclusive.next(this.exclusive)
    this.service.showIcon.next(this.showIcon)
    this.service.alwaysRender.next(this.alwaysRender)
    this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }
}
