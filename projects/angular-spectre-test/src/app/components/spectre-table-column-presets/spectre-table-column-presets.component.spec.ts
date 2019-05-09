import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectreTableColumnPresetsComponent } from './spectre-table-column-presets.component';

describe('SpectreTableColumnPresetsComponent', () => {
  let component: SpectreTableColumnPresetsComponent;
  let fixture: ComponentFixture<SpectreTableColumnPresetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpectreTableColumnPresetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpectreTableColumnPresetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
