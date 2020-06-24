import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellUsingCardReportComponent } from './sell-using-card-report.component';

describe('SellUsingCardReportComponent', () => {
  let component: SellUsingCardReportComponent;
  let fixture: ComponentFixture<SellUsingCardReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellUsingCardReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellUsingCardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
