import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpServices } from "../../http-service";
import { ExcelService } from "../../shared/components/helper/excel.service";
import { Storage } from "../../modals/app.class";
import { UserRoleChecker } from "../../user-role-service";
import { Location } from "@angular/common";
import { Pagination } from "../../modals/pagination";
import { MatPaginator } from "@angular/material";

import { UserDetails } from "../../modals/app.interface"; // added august-16 regan

@Component({
  selector: "app-gst-report",
  templateUrl: "./gst-report.component.html",
  styleUrls: ["./gst-report.component.scss"],
  animations: [routerTransition()]
})
export class GstReportComponent extends Pagination implements OnInit {
  // loginInfo: any;
  loginInfo: UserDetails; //added august-16 regan
  gstReportInfo: any;

  duration: any = [];
  dataFlag: number = 0;
  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private storage: Storage,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    super();
    this.excelService = excelService;
    this.loginInfo = this.storage.getObject("userDetails");
    var defaultDuration = "Monthly";
    this.gstReportFun(defaultDuration);
    // this.gstReportFun(1);
    // this.duration = ["Monthly", "Yearly", "Weekly", "Daily", "Hourly",];
    this.duration = ["Monthly", "Yearly"];
  }

  ngOnInit() {
    // localStorage.setItem("data lifehook", "this value");

    if (this.userRoleCheck("gst_report", "read") == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports
  noDataText: any = "";
  gstReportFun(val) {
    val = val == "Monthly" ? 1 : 12;
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let userID = userDetails.sysUser_ID;

    let param = {
      p_store_ID: this.loginInfo.store_ID,
      p_monthCount: val, //edited august-16 regan
      userID: userID
    };

    this.httpServices.gstReport(param).then((response: any) => {
      if (response.data.code === 0 && response.data.result && response.data.result[0].length) {
        this.dataFlag = 1;
        this.storage.setItem("isLoggedin", "true");
        localStorage.setItem("data random1", "do this");
        this.gstReportInfo = response.data["result"][0];
        this.total = response.data.result[0].length;
      } else {
        this.dataFlag = 2;
        this.noDataText = "Data Not found";
        localStorage.setItem("data random1", "do this either");
      }
    });
  }

  exportToExcel(event) {
    if (this.gstReportInfo) {
      this.excelService.exportAsExcelFile(
        this.gstReportInfo,
        "gstReportReport"
      );
    } else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.gstReportInfo object
    }
  }
  onSelectChange(val) {
    // console.log('val', val);
    // localStorage.setItem("data2", JSON.stringify(val.data.user));     // edited august-16 regan
    this.gstReportFun(val); //added august-16 regan
  }

  /*
    Method For Changing The Pagination
  */
  changePage(event: MatPaginator) {
    this.pageOptionsOnChange = event;
    if (this.total == 0) {
    }
    this.gstReportFun("data");
  }
}
