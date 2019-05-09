import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MediaModule } from '../media';
import { PanelModule } from '../panel';
import { KanbanComponent } from './kanban.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { KanbanBoardItemComponent } from './kanban-board/kanban-board-item/kanban-board-item.component';
// container directives
import { KanbanBoardTemplateDirective } from './kanban.directives';
// tslint:disable-next-line:max-line-length
import { KanbanBoardTitleDirective, KanbanBoardSubtitleDirective, KanbanBoardFooterDirective, KanbanBoardItemTemplateDirective } from './kanban-board/kanban-board.directives';
import { KanbanBoardItemContentDirective } from './kanban-board/kanban-board-item/kanban-board-item.directives';

@NgModule({
  declarations: [
    KanbanComponent,
    KanbanBoardComponent,
    KanbanBoardItemComponent,
    // container directives
    KanbanBoardTemplateDirective,
    KanbanBoardTitleDirective,
    KanbanBoardSubtitleDirective,
    KanbanBoardFooterDirective,
    KanbanBoardItemTemplateDirective,
    KanbanBoardItemContentDirective,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MediaModule,
    PanelModule,
  ],
  exports: [
    KanbanComponent,
    KanbanBoardComponent,
    KanbanBoardItemComponent,
    // container directives
    KanbanBoardTemplateDirective,
    KanbanBoardTitleDirective,
    KanbanBoardSubtitleDirective,
    KanbanBoardFooterDirective,
    KanbanBoardItemTemplateDirective,
    KanbanBoardItemContentDirective,
  ],
})
export class KanbanModule { }
