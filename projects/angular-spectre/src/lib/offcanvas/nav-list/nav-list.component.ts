import { Component, Input } from '@angular/core';

@Component({
  selector: 'spectre-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.scss'],
})
export class NavListComponent {
  @Input()
  text?: string
  @Input()
  href?: string
  @Input()
  path?: any
  @Input()
  queryParams?: any
  @Input()
  state?: any
}
