import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { TabComponent } from './tab/tab.component';
// container directives
import { TabsActionDirective } from './tabs.directives';

@NgModule({
  declarations: [
    TabsComponent,
    TabComponent,
    // container directives
    TabsActionDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TabsComponent,
    TabComponent,
    // container directives
    TabsActionDirective,
  ],
})
export class TabsModule { }
