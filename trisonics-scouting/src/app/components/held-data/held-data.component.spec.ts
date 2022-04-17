import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeldDataComponent } from './held-data.component';

describe('HeldDataComponent', () => {
  let component: HeldDataComponent;
  let fixture: ComponentFixture<HeldDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeldDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeldDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
