import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutOutOfStockReportComponent } from './about-out-of-stock-report.component';

describe('AboutOutOfStockReportComponent', () => {
  let component: AboutOutOfStockReportComponent;
  let fixture: ComponentFixture<AboutOutOfStockReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutOutOfStockReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutOutOfStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
