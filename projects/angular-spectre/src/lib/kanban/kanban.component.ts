// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterContentInit, OnChanges, Input, Output, ChangeDetectorRef, TemplateRef, EventEmitter, ContentChild } from '@angular/core';
import { KanbanService, KanbanMoveEvent } from './kanban.service';
import { KanbanBoardTemplateDirective } from './kanban.directives';

// @dynamic
@Component({
  selector: 'spectre-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  providers: [KanbanService],
})
export class KanbanComponent<TBoard = any, TItem = any> implements OnInit, OnDestroy, AfterContentInit, OnChanges {
  @Input()
  boards?: TBoard[]
  @Input()
  set height(value: string) {
    this.service.height.next(value)
  }
  @Input()
  trackBoardBy?: (board: TBoard) => any
  @Input()
  set trackBoardByKey(key: keyof TBoard) {
    this.trackBoardBy = board => board[key]
  }
  @Input()
  gaplessColumns = false

  @Output()
  boardsChange = new EventEmitter<TBoard[]>()
  @Output()
  itemMove = new EventEmitter<KanbanMoveEvent<TBoard, TItem>>()

  @ContentChild(KanbanBoardTemplateDirective, { read: TemplateRef })
  kanbanBoardTemplate?: TemplateRef<any>

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public service: KanbanService<TBoard, TItem>,
  ) {
    this.changeDetectorRef.detach()

    service.changeBoards = boards => this.boardsChange.emit(boards)
    service.moveItem = event => this.itemMove.emit(event)
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  trackBoardByFnOrIdx(index: number, board: TBoard) {
    return this.trackBoardBy ? this.trackBoardBy(board) : index
  }
}
