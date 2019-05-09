import { Directive } from '@angular/core';

@Directive({
  selector: '[spectreKanbanBoardTitle]',
})
export class KanbanBoardTitleDirective { }

@Directive({
  selector: '[spectreKanbanBoardSubtitle]',
})
export class KanbanBoardSubtitleDirective { }

@Directive({
  selector: '[spectreKanbanBoardFooter]',
})
export class KanbanBoardFooterDirective { }

@Directive({
  selector: '[spectreKanbanBoardItemTemplate]',
})
export class KanbanBoardItemTemplateDirective { }
