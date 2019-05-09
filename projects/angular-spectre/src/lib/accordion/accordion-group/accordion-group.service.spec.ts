import { TestBed } from '@angular/core/testing';

import { AccordionGroupService } from './accordion-group.service';

describe('AccordionGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccordionGroupService = TestBed.get(AccordionGroupService);
    expect(service).toBeTruthy();
  });
});
