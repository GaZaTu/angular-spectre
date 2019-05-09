import { TestBed } from '@angular/core/testing';

import { OffcanvasService } from './offcanvas.service';

describe('OffcanvasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OffcanvasService = TestBed.get(OffcanvasService);
    expect(service).toBeTruthy();
  });
});
