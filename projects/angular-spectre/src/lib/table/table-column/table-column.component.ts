import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { TableColumnCellDirective } from './table-column.directives';

@Component({
  selector: 'spectre-table-column',
  templateUrl: './table-column.component.html',
  styleUrls: ['./table-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnComponent {
  static presets = {} as { [key: string]: Partial<TableColumnComponent> }

  @Input()
  prop?: string
  @Input()
  name?: string
  @Input()
  flex?: number
  @Input()
  minWidth?: string
  @Input()
  filterKind?: 'input' | 'input-select' | 'select' | 'multi-select'
  @Input()
  filterOptions = [] as string[]
  @Input()
  hidden = false
  @Input()
  class?: string
  @Input()
  sortFn?: (a: any, b: any) => 1 | -1 | 0
  @Input()
  set lookupData(entries: { key: string, value: any }[]) {
    this.lookupDataMap = new Map(entries.map(entry => [entry.value, entry.key]) as [any, any])
  }
  @Input()
  stringify?: (value: any, row: any) => string
  @Input()
  set preset(key: string | undefined) {
    if (key) {
      const preset = TableColumnComponent.presets[key]

      if (preset) {
        if (preset.preset) {
          this.preset = preset.preset
        }

        Object.assign(this, preset)
      } else {
        console.warn(`TableColumnComponent.presets['${key}'] does not exist`)
      }
    }
  }

  @ContentChild(TableColumnCellDirective, { read: TemplateRef })
  cellTemplate?: TemplateRef<any>

  lookupDataMap?: Map<any, string>

  stringifyValue(value: any, row: any) {
    if (value === undefined || value === null) {
      return '-'
    } else if (this.stringify) {
      return this.stringify(value, row)
    } else {
      return String(value)
    }
  }

  get title() {
    if (this.name !== undefined) {
      return this.name
    } else {
      return this.prop
    }
  }
}
