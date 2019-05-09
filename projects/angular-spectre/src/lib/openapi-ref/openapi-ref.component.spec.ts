import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenapiRefComponent } from './openapi-ref.component';

describe('OpenapiRefComponent', () => {
  let component: OpenapiRefComponent;
  let fixture: ComponentFixture<OpenapiRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenapiRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenapiRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
