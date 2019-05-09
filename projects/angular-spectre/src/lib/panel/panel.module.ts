import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';
// container directives
// tslint:disable-next-line:max-line-length
import { PanelHeaderDirective, PanelTitleDirective, PanelSubtitleDirective, PanelNavDirective, PanelBodyDirective, PanelFooterDirective } from './panel.directives';

@NgModule({
  declarations: [
    PanelComponent,
    // container directives
    PanelHeaderDirective,
    PanelTitleDirective,
    PanelSubtitleDirective,
    PanelNavDirective,
    PanelBodyDirective,
    PanelFooterDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PanelComponent,
    // container directives
    PanelHeaderDirective,
    PanelTitleDirective,
    PanelSubtitleDirective,
    PanelNavDirective,
    PanelBodyDirective,
    PanelFooterDirective,
  ],
})
export class PanelModule { }
