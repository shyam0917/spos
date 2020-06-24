import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpServices } from "../../http-service";
import { ExcelService } from "../../shared/components/helper/excel.service";
import { UserRoleChecker } from "../../user-role-service";
import { Location } from "@angular/common";

@Component({
  selector: "app-inventory-report",
  templateUrl: "./inventory-report.component.html",
  styleUrls: ["./inventory-report.component.scss"],
  animations: [routerTransition()]
})
export class InventoryReportComponent implements OnInit {
  inventoryReportInfo: any;

  dataFlag: boolean;

  noDataText: any;
  loginInfo: any;
  limit;
  offset;
  count;

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private location: Location,
    // private storage: Storage,
    private userRoleChecker: UserRoleChecker
  ) {
    this.excelService = excelService;
    this.limit = localStorage.getItem("InventoryReportlimit")
      ? localStorage.getItem("InventoryReportlimit")
      : 5;
  }

  ngOnInit() {
    // this.loginInfo = this.storage.getObject("userDetails");
    this.getInventoryReport(this.limit, 0);
    this.loginInfo = localStorage.getItem("userDetails");
    this.getTotalCount();
    if (this.userRoleCheck("inventory_reports", "read") == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  getInventoryReport(lim, ski) {
    this.httpServices.stockReport(lim, ski).then((response: any) => {
      console.log("res", response.data.code);
      if (response.data.code === 0) {
        this.inventoryReportInfo = response.data.result;
        this.dataFlag = true;
        // console.log(this.gstItems);
      } else {
        this.dataFlag = false;
        this.noDataText = "Data Not found";
      }
    });
  }
  getTotalCount() {
    let param = {
      p_userId: JSON.parse(localStorage.getItem("userDetails")).sysUser_ID
    };
    this.httpServices.getProductCount(param).then((response: any) => {
      this.count = response.result["COUNT(*)"];
      // console.log("DG AQSKA______", response[0].result["COUNT(*)"]);
    });
  }
  exportToExcel(event) {
    this.httpServices.stockReport(99999999, 0).then(data => {
      this.excelService.exportAsExcelFile(
        data["data"]["result"],
        "inventoryReport"
      );
    });
    // if (this.inventoryReportInfo) {
    //   this.excelService.exportAsExcelFile(
    //     this.inventoryReportInfo,
    //     "inventoryReport"
    //   );
    // } else {
    //   alert("This request can not be completed right now, Please try again"); //no data found in this.inventoryReportInfo object
    // }
  }
  handlePaginator(data) {
    // console.log("paginator working", data);
    this.limit = data.pageSize;
    localStorage.setItem("InventoryReportlimit", this.limit);
    let skip = data.pageIndex ? data.pageIndex * data.pageSize : 0;
    this.getInventoryReport(this.limit, skip);
  }
}
