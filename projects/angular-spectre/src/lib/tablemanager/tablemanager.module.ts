import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TablemanagerComponent } from './tablemanager.component';
import { ButtonModule } from '../button';
import { ModalModule } from '../modal';
import { MediaModule } from '../media';
import { MenuModule } from '../menu';
// container directives
import { TablemanagerRouterOutletDirective } from './tablemanager.directives';

@NgModule({
  declarations: [
    TablemanagerComponent,
    // container directives
    TablemanagerRouterOutletDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ModalModule,
    MediaModule,
    MenuModule,
  ],
  exports: [
    TablemanagerComponent,
    // container directives
    TablemanagerRouterOutletDirective,
  ],
})
export class TablemanagerModule { }
