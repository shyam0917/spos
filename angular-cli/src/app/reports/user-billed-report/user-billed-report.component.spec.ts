import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBilledReportComponent } from './user-billed-report.component';

describe('UserBilledReportComponent', () => {
  let component: UserBilledReportComponent;
  let fixture: ComponentFixture<UserBilledReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBilledReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBilledReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
