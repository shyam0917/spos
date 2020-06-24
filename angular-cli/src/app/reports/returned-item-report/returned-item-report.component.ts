import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-returned-item-report',
  templateUrl: './returned-item-report.component.html',
  styleUrls: ['./returned-item-report.component.scss'],
  animations: [routerTransition()]
})
export class ReturnedItemReportComponent implements OnInit {


  loginInfo: any;
  returnedItemDetails: any;

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
    this.cashReportFun(defaultDuration);
    this.duration = ["Monthly", "Yearly", "Weekly", "Daily", "Hourly",];
  }

  ngOnInit() {
    if (this.userRoleCheck("returned_item_report", 'read') == false) {
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
    this.httpServices.returnedItemReport(param)
      .then((response: any) => {
        // console.log("response", response);
        if (response.data.code === 0) {
          this.dataFlag = true;
          this.returnedItemDetails = response.data.result;
          console.log(this.returnedItemDetails);
        }
        else {
          this.dataFlag = false;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.returnedItemDetails) {
      this.excelService.exportAsExcelFile(this.returnedItemDetails, 'returnedItemReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.returnedItemDetails object
    }
  }

  onSelectChange(val) {
    this.cashReportFun(val);
    console.log(val);
  }

}
