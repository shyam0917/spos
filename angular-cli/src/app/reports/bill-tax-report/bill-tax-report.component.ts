import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { Storage } from '../../modals/app.class';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bill-tax-report',
  templateUrl: './bill-tax-report.component.html',
  styleUrls: ['./bill-tax-report.component.scss'],
  animations: [routerTransition()]
})
export class BillTaxReportComponent implements OnInit {

  loginInfo: any;
  billTaxDetails: any;
  duration: any = [];
  dataFlag: boolean;

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private storage: Storage,
    private userRoleChecker: UserRoleChecker,
    private location: Location
  ) {
    this.excelService = excelService;
    this.loginInfo = this.storage.getObject('userDetails');
    var defaultDuration = "single";
    this.billTaxReportFun(defaultDuration);
    this.duration = ["single", "all"];
  }

  ngOnInit() {
    if (this.userRoleCheck("bill_report", 'read') == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports

  noDataText: any = "";
  billTaxReportFun(val) {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let userID = userDetails.sysUser_ID;
    let param = {
      p_store_ID: 152, //this.loginInfo.store_ID,
      p_transaction_ID: 1, // transaction id goes here
      p_queryType: val, // "single"/ "all"
      userID: userID
    };
    // console.log("param---->", param);
    this.httpServices.billTaxReport(param)
      .then((response: any) => {
        // console.log("response", response);
        if (response.data.code === 0) {
          this.dataFlag = true;
          this.billTaxDetails = response.data.result;
          // console.log(this.billTaxDetails);
        }
        else {
          this.dataFlag = false;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.billTaxDetails) {
      this.excelService.exportAsExcelFile(this.billTaxDetails, 'billTaxReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.billTaxDetails object
    }
  }

  onSelectChange(val) {
    this.billTaxReportFun(val);
    // console.log(val);
  }

}
