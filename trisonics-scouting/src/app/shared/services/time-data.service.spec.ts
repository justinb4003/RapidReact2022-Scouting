import { TestBed } from '@angular/core/testing';

import { TimeDataService } from './time-data.service';

describe('TimeDataService', () => {
  let service: TimeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
