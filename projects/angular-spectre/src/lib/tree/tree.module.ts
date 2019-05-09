import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TreeComponent } from './tree.component';
// container directives
import { TreeBranchDirective, TreeLeafDirective } from './tree.directives';

@NgModule({
  declarations: [
    TreeComponent,
    // container directives
    TreeBranchDirective,
    TreeLeafDirective,
  ],
  imports: [
    CommonModule,
    DragDropModule,
  ],
  exports: [
    TreeComponent,
    // container directives
    TreeBranchDirective,
    TreeLeafDirective,
  ],
})
export class TreeModule { }
