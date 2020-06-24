import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutOfStockReportComponent } from './out-of-stock-report.component';

describe('OutOfStockReportComponent', () => {
  let component: OutOfStockReportComponent;
  let fixture: ComponentFixture<OutOfStockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutOfStockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutOfStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
