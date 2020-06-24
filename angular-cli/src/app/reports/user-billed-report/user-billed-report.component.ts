import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { Storage } from '../../modals/app.class';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-billed-report',
  templateUrl: './user-billed-report.component.html',
  styleUrls: ['./user-billed-report.component.scss'],
  animations: [routerTransition()]
})
export class UserBilledReportComponent implements OnInit {

  loginInfo: any;
  billedDetails: any;
  dataFlag: boolean;
  noDataText: any = "";
  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private storage: Storage,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    this.excelService = excelService;
    this.loginInfo = this.storage.getObject('userDetails');
    this.userBilledReportFun();
  }

  ngOnInit() {
    if (this.userRoleCheck("user_billed_report", 'read') == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  userBilledReportFun() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    let userID = userDetails.sysUser_ID;
    let param = {
      p_store_ID: 152, //this.loginInfo.store_ID,
      p_transaction_ID: 1,  // transaction id goes here
      userID: userID
    };
    this.httpServices.userBillReport(param)
      .then((response: any) => {
        if (response.data.code === 0) {
          this.dataFlag = true;
          this.billedDetails = response.data.result;
        }
        else {
          this.dataFlag = false;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.billedDetails) {
      this.excelService.exportAsExcelFile(this.billedDetails, 'userBilledReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.billedDetails object
    }
  }

}
