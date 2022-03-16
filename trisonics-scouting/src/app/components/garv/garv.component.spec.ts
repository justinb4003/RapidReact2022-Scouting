import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarvComponent } from './garv.component';

describe('GarvComponent', () => {
  let component: GarvComponent;
  let fixture: ComponentFixture<GarvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GarvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GarvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
