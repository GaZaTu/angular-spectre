import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface KanbanMoveEvent<TBoard = any, TItem = any> {
  item: TItem
  sourceBoard: TBoard
  targetBoard: TBoard
  sourceIndex: number
  targetIndex: number
  pause: () => void
  continue: () => void
}

interface ItemMetaData {
  [key: string]: {
    loading: boolean
  }
}

@Injectable()
export class KanbanService<TBoard = any, TItem = any> {
  dropLists = new BehaviorSubject<any[]>([])
  boards = new BehaviorSubject<TBoard[]>([])
  height = new BehaviorSubject<string>('50vh')
  itemMetaData = new BehaviorSubject<ItemMetaData>(
    new Proxy({}, {
      get: (itemMetaData, p) => {
        return (itemMetaData[p] = itemMetaData[p] || {})
      },
    })
  )

  moveItem: (event: KanbanMoveEvent<TBoard, TItem>) => any
  changeBoards: (boards: TBoard[]) => any

  setMetaData(itemKey: any, key: keyof ItemMetaData[string], value: any) {
    this.itemMetaData.next(
      Object.assign(this.itemMetaData.value, {
        [itemKey]: Object.assign(this.itemMetaData.value[itemKey], {
          [key]: value,
        }),
      })
    )
  }

  getMetaData(itemKey: any, key: keyof ItemMetaData[string]) {
    return this.itemMetaData.value[itemKey][key]
  }
}
