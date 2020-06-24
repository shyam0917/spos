import { TestBed, inject } from '@angular/core/testing';

import { ErrorsHandlerService } from './errors-handler.service';

describe('ErrorsHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorsHandlerService]
    });
  });

  it('should be created', inject([ErrorsHandlerService], (service: ErrorsHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
