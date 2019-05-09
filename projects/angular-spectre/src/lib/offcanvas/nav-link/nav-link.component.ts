import { Component, Input } from '@angular/core';

@Component({
  selector: 'spectre-nav-link',
  templateUrl: './nav-link.component.html',
  styleUrls: ['./nav-link.component.scss'],
})
export class NavLinkComponent {
  @Input()
  href?: string
  @Input()
  path?: any
  @Input()
  queryParams?: any
  @Input()
  state?: any
}
