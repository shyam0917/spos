import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpServices } from "../../http-service";
import { ExcelService } from "../../shared/components/helper/excel.service";
import { UserRoleChecker } from "../../user-role-service";
import { Location } from "@angular/common";
import {
  MatDialog,
  MatPaginator,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { Pagination } from "../../modals/pagination";

@Component({
  selector: "app-store-wise-report",
  templateUrl: "./store-wise-report.component.html",
  styleUrls: ["./store-wise-report.component.scss"],
  animations: [routerTransition()]
})
export class StoreWiseReportComponent extends Pagination implements OnInit {
  storeWiseReportInfo: any;
  loginInfo: any;

  duration: any = [];
  dataFlag: boolean;

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    super();
    this.excelService = excelService;
    this.loginInfo = JSON.parse(localStorage.getItem("userDetails"));
    this.storeWiseReportFun();
  }

  ngOnInit() {
    if (this.userRoleCheck("store_wise_report", "read") == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports

  noDataText: any = "";
  storeWiseReportFun() {
    var storeIdArray = [152];
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let userID = userDetails.sysUser_ID;
    let param = {
      p_store_ID: storeIdArray, //this.loginInfo.store_ID,
      userID: userID,
      ...this.validPageOptions
    };

    this.httpServices.storeWiseReport(param).then((response: any) => {
      if (response.data.code === 0) {
        this.storeWiseReportInfo = response.data.result;
        this.total = response.data.result[0].totalRecord;
        this.dataFlag = true;
      }
      //  else if(response.data.code === 1)
      // {
      //   console.log("2")
      //    this.dataFlag = true;
      // }
      else {
        this.dataFlag = false;
        this.noDataText = "Data Not found";
      }
    });
  }

  exportToExcel(event) {
    if (this.storeWiseReportInfo) {
      this.excelService.exportAsExcelFile(
        this.storeWiseReportInfo,
        "storeWiseReport"
      );
    } else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.storeWiseReportInfo object
    }
  }

  /*
    Method For Changing The Pagination
  */
  changePage(event: MatPaginator) {
    this.pageOptionsOnChange = event;
    if (this.total == 0) {
    }
    this.storeWiseReportFun();
  }
}
