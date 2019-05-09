import { Directive } from '@angular/core';

@Directive({
  selector: '[spectreOffcanvasBrand]',
})
export class OffcanvasBrandDirective { }

@Directive({
  selector: '[spectreOffcanvasNavbar]',
})
export class OffcanvasNavbarDirective { }

@Directive({
  selector: '[spectreOffcanvasSidebar]',
})
export class OffcanvasSidebarDirective { }

@Directive({
  selector: '[spectreOffcanvasContent]',
})
export class OffcanvasContentDirective { }

@Directive({
  selector: '[spectreOffcanvasFooter]',
})
export class OffcanvasFooterDirective { }
