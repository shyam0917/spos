import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredGoodsReportComponent } from './expired-goods-report.component';

describe('ExpiredGoodsReportComponent', () => {
  let component: ExpiredGoodsReportComponent;
  let fixture: ComponentFixture<ExpiredGoodsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredGoodsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredGoodsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
