import { Component, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { TableColumnComponent } from 'angular-spectre';

@Component({
  selector: 'app-spectre-table-column-presets',
  templateUrl: './spectre-table-column-presets.component.html',
  styleUrls: ['./spectre-table-column-presets.component.scss'],
})
export class SpectreTableColumnPresetsComponent implements AfterViewInit {
  @ViewChild('expandColTemplate')
  expandColTemplate: TemplateRef<any>

  ngAfterViewInit() {
    TableColumnComponent.presets.date = {
      filterKind: 'input',
      stringify: v => new Date(v).toLocaleDateString(),
    }

    TableColumnComponent.presets.expandCol = {
      prop: '_expand',
      name: '',
      flex: 1,
      class: 'expand-col',
      cellTemplate: this.expandColTemplate,
    }
  }
}
