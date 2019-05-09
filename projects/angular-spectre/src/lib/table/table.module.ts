import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MediaModule } from '../media';
import { FormModule } from '../form';
import { MenuModule } from '../menu';
import { AutocompleteModule } from '../autocomplete';
import { ConfigModule } from '../config/config.module';
import { TableComponent } from './table.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TableColumnComponent } from './table-column/table-column.component';
// container directives
import { TableCaptionDirective, TableEmptyDirective, TableFooterDirective, TableRowDetailDirective } from './table.directives';
import { TableColumnCellDirective } from './table-column/table-column.directives';

@NgModule({
  declarations: [
    TableComponent,
    PaginationComponent,
    TableColumnComponent,
    // container directives
    TableCaptionDirective,
    TableEmptyDirective,
    TableFooterDirective,
    TableRowDetailDirective,
    TableColumnCellDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MediaModule,
    FormModule,
    MenuModule,
    AutocompleteModule,
    ConfigModule,
  ],
  exports: [
    TableComponent,
    PaginationComponent,
    TableColumnComponent,
    // container directives
    TableCaptionDirective,
    TableEmptyDirective,
    TableFooterDirective,
    TableRowDetailDirective,
    TableColumnCellDirective,
  ],
})
export class TableModule { }
