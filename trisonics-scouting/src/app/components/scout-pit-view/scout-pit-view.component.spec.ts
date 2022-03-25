import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutPitViewComponent } from './scout-pit-view.component';

describe('ScoutPitViewComponent', () => {
  let component: ScoutPitViewComponent;
  let fixture: ComponentFixture<ScoutPitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoutPitViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutPitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
