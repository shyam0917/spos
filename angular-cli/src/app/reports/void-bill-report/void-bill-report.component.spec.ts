import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidBillReportComponent } from './void-bill-report.component';

describe('VoidBillReportComponent', () => {
  let component: VoidBillReportComponent;
  let fixture: ComponentFixture<VoidBillReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoidBillReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidBillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
