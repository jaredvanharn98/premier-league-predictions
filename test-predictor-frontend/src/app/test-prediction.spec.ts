import { TestBed } from '@angular/core/testing';

import { TestPrediction } from './test-prediction';

describe('TestPrediction', () => {
  let service: TestPrediction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestPrediction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
