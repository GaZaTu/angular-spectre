import { TestBed } from '@angular/core/testing';

import { InputGroupService } from './input-group.service';

describe('InputGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InputGroupService = TestBed.get(InputGroupService);
    expect(service).toBeTruthy();
  });
});
