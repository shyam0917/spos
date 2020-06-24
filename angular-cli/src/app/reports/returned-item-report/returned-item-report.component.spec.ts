import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnedItemReportComponent } from './returned-item-report.component';

describe('ReturnedItemReportComponent', () => {
  let component: ReturnedItemReportComponent;
  let fixture: ComponentFixture<ReturnedItemReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnedItemReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnedItemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
