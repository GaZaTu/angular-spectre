// tslint:disable-next-line:max-line-length
import { Component, AfterContentInit, OnDestroy, OnChanges, Input, TemplateRef, ChangeDetectorRef, ContentChild } from '@angular/core';
import { KanbanBoardItemContentDirective } from './kanban-board-item.directives';

@Component({
  selector: 'spectre-kanban-board-item',
  templateUrl: './kanban-board-item.component.html',
  styleUrls: ['./kanban-board-item.component.scss'],
})
export class KanbanBoardItemComponent<TItem = any> implements AfterContentInit, OnDestroy, OnChanges {
  @Input()
  data: TItem

  @ContentChild(KanbanBoardItemContentDirective, { read: TemplateRef })
  content?: TemplateRef<any>

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnDestroy() { }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }
}
