import { TestBed } from '@angular/core/testing';

import { TablemanagerService } from './tablemanager.service';

describe('TablemanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TablemanagerService = TestBed.get(TablemanagerService);
    expect(service).toBeTruthy();
  });
});
