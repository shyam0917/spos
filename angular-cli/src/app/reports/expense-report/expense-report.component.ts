import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpServices } from "../../http-service";
import { ExcelService } from "../../shared/components/helper/excel.service";
import { UserRoleChecker } from "../../user-role-service";
import { Location } from "@angular/common";
import { Pagination } from "../../modals/pagination";
import { MatPaginator } from "@angular/material";

@Component({
  selector: "app-expense-report",
  templateUrl: "./expense-report.component.html",
  styleUrls: ["./expense-report.component.scss"],
  animations: [routerTransition()]
})
export class ExpenseReportComponent extends Pagination implements OnInit {
  expenseReportInfo: any;
  dataFlag: boolean;


  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    super();
    this.excelService = excelService;
    this.expenseReportFun();
  }

  ngOnInit() {
    if (this.userRoleCheck("expense_report", "read") == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports

  noDataText: any = "";

  expenseReportFun() {
    let data = {
      ...this.validPageOptions
    };
    this.httpServices.expenseReport(data).then((response: any) => {
      if (response.data.code === 0) {
        this.dataFlag = true;
        this.expenseReportInfo = response.data.result;
        this.total = response.data.result[0].totalRecord;
        // console.log(this.profitReportInfo);
      } else {
        this.dataFlag = false;
        this.noDataText = "Data Not found";
      }
    });
  }

  exportToExcel(event) {
    if (this.expenseReportInfo) {
      this.excelService.exportAsExcelFile(
        this.expenseReportInfo,
        "expenseReport"
      );
    } else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.expenseReportInfo object
    }
  }

  /*
    Method For Changing The Pagination
  */
  changePage(event: MatPaginator) {
    this.pageOptionsOnChange = event;
    if (this.total == 0) {
    }
    this.expenseReportFun();
  }
}
