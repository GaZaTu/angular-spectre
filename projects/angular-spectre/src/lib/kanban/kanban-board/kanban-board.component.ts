// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterViewInit, AfterContentInit, OnChanges, Input, TemplateRef, ChangeDetectorRef, ViewChild, ContentChild } from '@angular/core';
import { KanbanService } from '../kanban.service';
import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { KanbanBoardItemComponent } from './kanban-board-item/kanban-board-item.component';
// tslint:disable-next-line:max-line-length
import { KanbanBoardTitleDirective, KanbanBoardSubtitleDirective, KanbanBoardFooterDirective, KanbanBoardItemTemplateDirective } from './kanban-board.directives';
import { Subscribe } from '../../../utils';

// @dynamic
@Component({
  selector: 'spectre-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent<TBoard = any, TItem = any> implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, OnChanges {
  @Input()
  data: TBoard
  @Input()
  items: TItem[]
  @Input()
  dropPredicate?: (item: TItem) => boolean
  @Input()
  trackItemBy?: (item: TItem) => any
  @Input()
  set trackItemByKey(key: keyof TItem) {
    this.trackItemBy = item => item[key]
  }

  @ContentChild(KanbanBoardTitleDirective, { read: TemplateRef })
  titleTemplate?: TemplateRef<any>
  @ContentChild(KanbanBoardSubtitleDirective, { read: TemplateRef })
  subtitleTemplate?: TemplateRef<any>
  @ContentChild(KanbanBoardFooterDirective, { read: TemplateRef })
  footerTemplate?: TemplateRef<any>
  @ContentChild(KanbanBoardItemTemplateDirective, { read: TemplateRef })
  kanbanBoardItemTemplate?: TemplateRef<any>

  @ViewChild('dropList')
  dropList: any

  dropListsWithoutThis = [] as any[]

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public kanbanService: KanbanService,
  ) {
    this.changeDetectorRef.detach()
  }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterViewInit() {
    this.kanbanService.dropLists.next([...this.kanbanService.dropLists.value, this.dropList])
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges()
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: KanbanBoardComponent) => self.kanbanService.height)
  onHeightChange() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: KanbanBoardComponent) => self.kanbanService.itemMetaData)
  onItemMetaChange() {
    this.changeDetectorRef.detectChanges()
  }

  @Subscribe((self: KanbanBoardComponent) => self.kanbanService.dropLists)
  onDropListsChange() {
    this.dropListsWithoutThis = this.kanbanService.dropLists.value.filter(l => l !== this.dropList)
    this.changeDetectorRef.detectChanges()
  }

  trackItemByFnOrIdx(index: number, item: TItem) {
    return this.trackItemBy ? this.trackItemBy(item) : index
  }

  onDropListDropped(event: CdkDragDrop<KanbanBoardComponent>) {
    const itemKey = this.trackItemBy(event.item.data)

    if (this.kanbanService.itemMetaData.value[itemKey].loading) {
      return
    }

    const prevBoard = event.previousContainer.data as KanbanBoardComponent
    const nextBoard = event.container.data as KanbanBoardComponent
    const item = event.item.data as TItem

    this.kanbanService.moveItem({
      item,
      sourceBoard: prevBoard.data,
      targetBoard: nextBoard.data,
      sourceIndex: event.previousIndex,
      targetIndex: event.currentIndex,
      pause: () => {
        this.kanbanService.setMetaData(itemKey, 'loading', true)
      },
      continue: () => {
        this.kanbanService.setMetaData(itemKey, 'loading', false)
      },
    })

    this.kanbanService.changeBoards(
      this.kanbanService.boards.value.map(b => {
        let items = [...b.items]

        if (b === prevBoard.data) {
          items = items.filter(i => i !== item)
        }

        if (b === nextBoard.data) {
          items = [...items, item]
        }

        return Object.assign({}, b, { items })
      })
    )
  }

  dropListPredicate(event: CdkDrag<KanbanBoardItemComponent>) {
    if (this.dropPredicate) {
      return this.dropPredicate(event.data.data)
    } else {
      return true
    }
  }
}
