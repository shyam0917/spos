import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialDiscountReportComponent } from './special-discount-report.component';

describe('SpecialDiscountReportComponent', () => {
  let component: SpecialDiscountReportComponent;
  let fixture: ComponentFixture<SpecialDiscountReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialDiscountReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialDiscountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
