import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStoreReportComponent } from './all-store-report.component';

describe('AllStoreReportComponent', () => {
  let component: AllStoreReportComponent;
  let fixture: ComponentFixture<AllStoreReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllStoreReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllStoreReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
