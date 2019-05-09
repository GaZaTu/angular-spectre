import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablemanagerComponent } from './tablemanager.component';

describe('TablemanagerComponent', () => {
  let component: TablemanagerComponent;
  let fixture: ComponentFixture<TablemanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablemanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
