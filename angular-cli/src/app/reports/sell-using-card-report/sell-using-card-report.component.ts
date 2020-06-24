import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sell-using-card-report',
  templateUrl: './sell-using-card-report.component.html',
  styleUrls: ['./sell-using-card-report.component.scss'],
  animations: [routerTransition()]
})
export class SellUsingCardReportComponent implements OnInit {
  loginInfo: any;
  sellUsingCardReportInfo: any;

  duration: any = [];

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    this.excelService = excelService;
    this.loginInfo = JSON.parse(localStorage.getItem('userDetails'));
    var defaultDuration = "Monthly";
    this.cashReportFun(defaultDuration);
    this.duration = ["Monthly", "Yearly", "Weekly", "Daily", "Hourly",];
  }

  ngOnInit() {
    if (this.userRoleCheck("sell_using_card_report", 'read') == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  dataFlag: number = 0;
  noDataText: any = "";
  cashReportFun(val) {

    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let userID = userDetails.sysUser_ID;

    let param = {
      p_store_ID: 152, //this.loginInfo.store_ID,
      p_queryType: val,
      userID: userID
    };

    this.httpServices.sellUsingCardReport(param)
      .then((response: any) => {
        // console.log("response", response);
        if (response.data.code === 0) {
          this.dataFlag = 1;
          this.sellUsingCardReportInfo = response.data.result;
          // console.log(this.sellUsingCardReportinfo);
        }
        else {
          this.dataFlag = 2;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.sellUsingCardReportInfo) {
      this.excelService.exportAsExcelFile(this.sellUsingCardReportInfo, 'sellUsingCardReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.sellUsingCardReportInfo object
    }
  }

  onSelectChange(val) {
    this.cashReportFun(val);
    // console.log(val);
  }

}
