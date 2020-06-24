import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnedCashReportComponent } from './returned-cash-report.component';

describe('ReturnedCashReportComponent', () => {
  let component: ReturnedCashReportComponent;
  let fixture: ComponentFixture<ReturnedCashReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnedCashReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnedCashReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
