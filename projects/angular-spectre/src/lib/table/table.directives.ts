import { Directive } from '@angular/core';

@Directive({
  selector: '[spectreTableCaption]',
})
export class TableCaptionDirective { }

@Directive({
  selector: '[spectreTableEmpty]',
})
export class TableEmptyDirective { }

@Directive({
  selector: '[spectreTableFooter]',
})
export class TableFooterDirective { }

@Directive({
  selector: '[spectreTableRowDetail]',
})
export class TableRowDetailDirective { }
