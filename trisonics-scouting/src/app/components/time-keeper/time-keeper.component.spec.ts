import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeKeeperComponent } from './time-keeper.component';

describe('TimeKeeperComponent', () => {
  let component: TimeKeeperComponent;
  let fixture: ComponentFixture<TimeKeeperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeKeeperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeKeeperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
