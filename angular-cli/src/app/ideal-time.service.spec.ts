import { TestBed } from '@angular/core/testing';

import { IdealTimeService } from './ideal-time.service';

describe('IdealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdealTimeService = TestBed.get(IdealTimeService);
    expect(service).toBeTruthy();
  });
});
