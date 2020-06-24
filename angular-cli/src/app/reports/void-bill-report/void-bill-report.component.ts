import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { Storage } from '../../modals/app.class';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-void-bill-report',
  templateUrl: './void-bill-report.component.html',
  styleUrls: ['./void-bill-report.component.scss'],
  animations: [routerTransition()]
})
export class VoidBillReportComponent implements OnInit {

  loginInfo: any;
  voidBillDetails: any;

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
    this.cashReportFun(defaultDuration);
    this.duration = ["Monthly", "Yearly", "Weekly", "Daily", "Hourly",];
  }

  ngOnInit() {
    if (this.userRoleCheck("void_bill_report", 'read') == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports

  noDataText: any = "";
  cashReportFun(val) {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let userID = userDetails.sysUser_ID;
    let param = {
      p_store_ID: 152, //this.loginInfo.store_ID,     
      p_queryType: val,
      userID: userID
    };
    // console.log("param---->", param);
    this.httpServices.voidBillReport(param)
      .then((response: any) => {
        // console.log("response", response);
        if (response.data.code === 0) {
          this.dataFlag = true;
          this.voidBillDetails = response.data.result;
          // console.log(this.voidBillDetails);
        }
        else {
          this.dataFlag = false;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.voidBillDetails) {
      this.excelService.exportAsExcelFile(this.voidBillDetails, 'voidBillReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.voidBillDetails object
    }
  }

  onSelectChange(val) {
    this.cashReportFun(val);
    // console.log(val);
  }

}
