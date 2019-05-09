import { Directive } from '@angular/core';

@Directive({
  selector: '[spectreTreeBranch]',
})
export class TreeBranchDirective { }

@Directive({
  selector: '[spectreTreeLeaf]',
})
export class TreeLeafDirective { }
