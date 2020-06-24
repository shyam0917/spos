import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { Storage } from '../../modals/app.class';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-profit-report',
  templateUrl: './profit-report.component.html',
  styleUrls: ['./profit-report.component.scss'],
  animations: [routerTransition()]
})
export class ProfitReportComponent implements OnInit {

  profitReportInfo: any;
  loginInfo: any;

  duration: any = [];
  dataFlag: boolean;

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private storage: Storage,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    this.excelService = excelService;
    this.loginInfo = this.storage.getObject('userDetails');
    var defaultDuration = "Monthly";
    this.profitReportFun(defaultDuration);
    this.duration = ["Monthly", "Yearly", "Weekly", "Daily", "Hourly",];
  }

  ngOnInit() {
    if (this.userRoleCheck("profit_report", 'read') == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports
  noDataText: any = "";
  profitReportFun(val) {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let userID = userDetails.sysUser_ID;
    let param = {
      p_store_ID: 152, //this.loginInfo.store_ID,
      p_queryType: val,
      userID: userID
    };

    this.httpServices.profitReport(param)
      .then((response: any) => {
        // console.log("response", response);
        if (response.data.code === 0) {
          this.dataFlag = true;
          this.profitReportInfo = response.data.result;
          // console.log(this.profitReportInfo);
        }
        else {
          this.dataFlag = false;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.profitReportInfo) {
      this.excelService.exportAsExcelFile(this.profitReportInfo, 'profitReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.profitReportInfo object
    }
  }

  onSelectChange(val) {
    this.profitReportFun(val);
    // console.log(val);
  }


}
