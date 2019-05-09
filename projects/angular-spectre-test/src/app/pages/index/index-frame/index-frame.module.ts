import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexFrameComponent } from './index-frame.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { ButtonModule, MediaModule, FormModule, ModalModule, ToastModule, TabsModule, MenuModule, AutocompleteModule, TableModule, CalendarModule, OffcanvasModule, PanelModule, KanbanModule, TreeModule } from 'angular-spectre';
import { AppLibModule } from '../../../app-lib.module';

@NgModule({
  declarations: [
    IndexFrameComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    MediaModule,
    FormModule,
    ModalModule,
    ToastModule,
    TabsModule,
    MenuModule,
    AutocompleteModule,
    TableModule,
    CalendarModule,
    OffcanvasModule,
    PanelModule,
    KanbanModule,
    TreeModule,
    AppLibModule,
  ],
  exports: [
    IndexFrameComponent,
  ],
})
export class IndexFrameModule { }
