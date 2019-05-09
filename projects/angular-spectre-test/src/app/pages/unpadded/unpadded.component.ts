import { Component, OnInit, OnDestroy } from '@angular/core';
import { UnpaddedContent } from '../../utils/unpadded-content';
import { OffcanvasService } from 'angular-spectre';

@UnpaddedContent()
@Component({
  selector: 'app-fullscreen',
  template: `
    <h3 appStickyTitle>Unpadded</h3>
    <app-unpadded-frame></app-unpadded-frame>
  `,
})
export class UnpaddedComponent implements OnInit, OnDestroy {
  constructor(
    public offcanvasService: OffcanvasService,
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }
}
