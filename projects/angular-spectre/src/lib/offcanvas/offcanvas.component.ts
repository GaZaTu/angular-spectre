// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterContentInit, OnChanges, TemplateRef, ChangeDetectorRef, ContentChild } from '@angular/core';
import { OffcanvasService } from './offcanvas.service';
// tslint:disable-next-line:max-line-length
import { OffcanvasBrandDirective, OffcanvasNavbarDirective, OffcanvasSidebarDirective, OffcanvasContentDirective, OffcanvasFooterDirective } from './offcanvas.directives';
import { Subscribe } from '../../utils';

// @dynamic
@Component({
  selector: 'spectre-offcanvas',
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.scss'],
  providers: [OffcanvasService],
})
export class OffcanvasComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
  @ContentChild(OffcanvasBrandDirective, { read: TemplateRef })
  brand?: TemplateRef<any>
  @ContentChild(OffcanvasNavbarDirective, { read: TemplateRef })
  navbar?: TemplateRef<any>
  @ContentChild(OffcanvasSidebarDirective, { read: TemplateRef })
  sidebar?: TemplateRef<any>
  @ContentChild(OffcanvasContentDirective, { read: TemplateRef })
  content?: TemplateRef<any>
  @ContentChild(OffcanvasFooterDirective, { read: TemplateRef })
  footer?: TemplateRef<any>

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public service: OffcanvasService,
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

  @Subscribe((self: OffcanvasComponent) => self.service.sidebarVisibility)
  @Subscribe((self: OffcanvasComponent) => self.service.contentPadding)
  onServiceChange() {
    this.changeDetectorRef.detectChanges()
  }
}
