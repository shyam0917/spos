import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { Storage } from '../../modals/app.class';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.scss'],
  animations: [routerTransition()]
})
export class CustomerReportComponent implements OnInit {
  loginInfo: any;
  customerDetails: any;

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
    this.customerReportFun(defaultDuration);
    this.duration = ["Monthly", "Yearly", "Weekly", "Daily",];
  }

  ngOnInit() {
    if (this.userRoleCheck("customerwise_report", 'read') == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports
  noDataText: any = "";
  customerReportFun(val) {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let userID = userDetails.sysUser_ID;
    let param = {
      p_store_ID: 152, //this.loginInfo.store_ID,
      p_queryType: val,
      userID: userID
    };
    // console.log("param---->", param);
    this.httpServices.customerReport(param)
      .then((response: any) => {
        // console.log("response", response);
        if (response.data.code === 0) {
          this.dataFlag = true;
          this.customerDetails = response.data.result;
          // console.log(this.customerDetails);
        }
        else {
          this.dataFlag = false;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.customerDetails) {
      this.excelService.exportAsExcelFile(this.customerDetails, 'customerWiseReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.customerDetails object
    }
  }

  onSelectChange(val) {
    this.customerReportFun(val);
    // console.log(val);
  }

}
