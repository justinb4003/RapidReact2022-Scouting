import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutPitComponent } from './scout-pit.component';

describe('ScoutPitComponent', () => {
  let component: ScoutPitComponent;
  let fixture: ComponentFixture<ScoutPitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoutPitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutPitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
