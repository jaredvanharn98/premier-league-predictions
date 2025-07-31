import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPredictionForm } from './test-prediction-form';

describe('TestPredictionForm', () => {
  let component: TestPredictionForm;
  let fixture: ComponentFixture<TestPredictionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPredictionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestPredictionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
