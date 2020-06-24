import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-special-discount-report',
  templateUrl: './special-discount-report.component.html',
  styleUrls: ['./special-discount-report.component.scss'],
  animations: [routerTransition()]
})
export class SpecialDiscountReportComponent implements OnInit {
  loginInfo: any;
  specialDiscountReportInfo: any;

  duration: any = [];
  dataFlag: number = 0;


  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    this.excelService = excelService;
    this.loginInfo = JSON.parse(localStorage.getItem('userDetails'));
    var defaultDuration = "Monthly";
    this.specialDiscountReportFun(defaultDuration);
    this.duration = ["Monthly", "Yearly", "Weekly", "Daily", "Hourly",];
  }

  ngOnInit() {
    if (this.userRoleCheck("special_discount_report", 'read') == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports

  noDataText: any = "";
  specialDiscountReportFun(val) {
    // debugger
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let userID = userDetails.sysUser_ID;

    let param = {
      p_store_ID: 152, //this.loginInfo.store_ID,
      p_queryType: val,
      userID: userID
    };

    this.httpServices.specialDiscountReport(param)
      .then((response: any) => {
        // console.log("response", response);
        if (response.data.code === 0) {
          this.dataFlag = 1;
          this.specialDiscountReportInfo = response.data.result;
          // console.log(this.gstReportInfo);
        }
        else {
          this.dataFlag = 2;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.specialDiscountReportInfo) {
      this.excelService.exportAsExcelFile(this.specialDiscountReportInfo, 'specialDiscountReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.specialDiscountReportInfo object
    }
  }

  onSelectChange(val) {
    this.specialDiscountReportFun(val);
    // console.log(val);
  }

}
