import { TestBed } from '@angular/core/testing';

import { FaIconService } from './fa-icon.service';

describe('FaIconService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaIconService = TestBed.get(FaIconService);
    expect(service).toBeTruthy();
  });
});
