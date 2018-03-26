import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleOverlayComponent } from './vehicle-overlay.component';

describe('VehicleOverlayComponent', () => {
  let component: VehicleOverlayComponent;
  let fixture: ComponentFixture<VehicleOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
