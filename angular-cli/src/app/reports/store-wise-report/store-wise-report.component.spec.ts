import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreWiseReportComponent } from './store-wise-report.component';

describe('StoreWiseReportComponent', () => {
  let component: StoreWiseReportComponent;
  let fixture: ComponentFixture<StoreWiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreWiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
