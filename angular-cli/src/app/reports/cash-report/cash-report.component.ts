import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpServices } from "../../http-service";
import { ExcelService } from "../../shared/components/helper/excel.service";
import { Storage } from "../../modals/app.class";
import { UserRoleChecker } from "../../user-role-service";
import { Location } from "@angular/common";
import * as XLSX from "xlsx";

@Component({
  selector: "app-cash-report",
  templateUrl: "./cash-report.component.html",
  styleUrls: ["./cash-report.component.scss"],
  animations: [routerTransition()]
})
export class CashReportComponent implements OnInit {
  loginInfo: any;
  cashDetails: any;

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
    this.loginInfo = this.storage.getObject("userDetails");
    var defaultDuration = "Monthly";
    this.cashReportFun(defaultDuration);
    this.duration = ["Monthly", "Yearly", "Weekly", "Daily", "Hourly"];
  }

  ngOnInit() {
    if (this.userRoleCheck("cash_summary", "read") == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports
  noDataText: any = "";

  cashReportFun(val) {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let userID = userDetails.sysUser_ID;
    let param = {
      p_store_ID: 152, //this.loginInfo.store_ID,
      p_queryType: val,
      userID: userID
    };
    // console.log("param---->", param);
    this.httpServices.cashReport(param).then((response: any) => {
      // console.log("response", response);
      if (response.data.code === 0) {
        this.dataFlag = true;
        this.cashDetails = response.data.result;
        // console.log(this.cashDetails);
      } else {
        this.dataFlag = false;
        this.noDataText = "Data Not found";
      }
    });
  }

  exportToExcel(event) {
    const ws = XLSX.utils.aoa_to_sheet(this.cashDetails);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "SheetJS.xlsx");

    return;
    if (this.cashDetails) {
      this.excelService.exportAsExcelFile(this.cashDetails, "cashReport");
    } else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.cashDetails object
    }
  }

  onSelectChange(val) {
    this.cashReportFun(val);
    // console.log(val);
  }
}
