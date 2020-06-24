import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerWiseReportComponent } from './manager-wise-report.component';

describe('ManagerWiseReportComponent', () => {
  let component: ManagerWiseReportComponent;
  let fixture: ComponentFixture<ManagerWiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerWiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
