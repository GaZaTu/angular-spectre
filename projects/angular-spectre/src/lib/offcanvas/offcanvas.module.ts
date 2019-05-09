import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OffcanvasComponent } from './offcanvas.component';
import { NavListComponent } from './nav-list/nav-list.component';
import { NavLinkComponent } from './nav-link/nav-link.component';
// container directives
// tslint:disable-next-line:max-line-length
import { OffcanvasBrandDirective, OffcanvasNavbarDirective, OffcanvasSidebarDirective, OffcanvasContentDirective, OffcanvasFooterDirective } from './offcanvas.directives';

@NgModule({
  declarations: [
    OffcanvasComponent,
    NavListComponent,
    NavLinkComponent,
    // container directives
    OffcanvasBrandDirective,
    OffcanvasNavbarDirective,
    OffcanvasSidebarDirective,
    OffcanvasContentDirective,
    OffcanvasFooterDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    OffcanvasComponent,
    NavListComponent,
    NavLinkComponent,
    // container directives
    OffcanvasBrandDirective,
    OffcanvasNavbarDirective,
    OffcanvasSidebarDirective,
    OffcanvasContentDirective,
    OffcanvasFooterDirective,
  ],
})
export class OffcanvasModule { }
