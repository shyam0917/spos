import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-returned-cash-report',
  templateUrl: './returned-cash-report.component.html',
  styleUrls: ['./returned-cash-report.component.scss'],
  animations: [routerTransition()]
})
export class ReturnedCashReportComponent implements OnInit {
  returnedCashReportInfo: any;
  loginInfo: any;

  duration: any = [];
  dataFlag: boolean;

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    this.excelService = excelService;
    this.loginInfo = JSON.parse(localStorage.getItem('userDetails'));
    var defaultDuration = "Monthly";
    this.returnedCashReportInfoFun(defaultDuration);
    this.duration = ["Monthly", "Yearly", "Weekly", "Daily", "Hourly",];
  }

  ngOnInit() {
    if (this.userRoleCheck("returned_cash_report", 'read') == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports
  noDataText: any = "";
  returnedCashReportInfoFun(val) {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let userID = userDetails.sysUser_ID;
    let param = {
      p_store_ID: 152, //this.loginInfo.store_ID,
      p_queryType: val,
      userID: userID
    };

    this.httpServices.returnedCashReport(param)
      .then((response: any) => {
        // console.log("response", response);
        if (response.data.code === 0) {
          this.dataFlag = true;
          this.returnedCashReportInfo = response.data.result;
          // console.log(this.profitReportInfo);
        }
        else {
          this.dataFlag = false;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.returnedCashReportInfo) {
      this.excelService.exportAsExcelFile(this.returnedCashReportInfo, 'returnedCashReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.returnedCashReportInfo object
    }
  }

  onSelectChange(val) {
    this.returnedCashReportInfoFun(val);
    // console.log(val);
  }

}
