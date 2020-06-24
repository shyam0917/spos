import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTaxReportComponent } from './bill-tax-report.component';

describe('BillTaxReportComponent', () => {
  let component: BillTaxReportComponent;
  let fixture: ComponentFixture<BillTaxReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillTaxReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillTaxReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
