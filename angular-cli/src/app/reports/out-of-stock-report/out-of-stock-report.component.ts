import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpServices } from "../../http-service";
import { ExcelService } from "../../shared/components/helper/excel.service";
import { UserRoleChecker } from "../../user-role-service";
import { Location } from "@angular/common";
import { Pagination } from '../../modals/pagination';
import { MatPaginator } from '@angular/material';

@Component({
  selector: "app-out-of-stock-report",
  templateUrl: "./out-of-stock-report.component.html",
  styleUrls: ["./out-of-stock-report.component.scss"],
  animations: [routerTransition()]
})
export class OutOfStockReportComponent extends Pagination implements OnInit {
  outOfStockReportInfo: any;
  dataFlag: boolean;

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    super();
    this.excelService = excelService;
    this.getInventoryReport();
  }

  ngOnInit() {
    if (this.userRoleCheck("out_of_stock_report", "read") == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  getInventoryReport() {
    var param = {
      ...this.validPageOptions
    }
    this.httpServices.outOfStockReport(param).then((response: any) => {
      console.log(response, "res");
      if (response.data.code === 0) {
        this.outOfStockReportInfo = response.data.result;
        this.total = response.data.result[0].totalRecord;
        this.dataFlag = true;
      } else {
        this.dataFlag = false;
      }
    });
  }




  exportToExcel(event) {
    var query;
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails.code === "SADM") {
      query = `select * from tbl_product where isDeleted = 0 and totalstock <= 0 `;
    } else {
      query = `select * from tbl_product where isDeleted = 0 and Store_ID = ${userDetails.store_ID} and totalstock <= 0 `;
    }
    this.httpServices.expiredGoodsReportForExcel(query).subscribe(res => {
      if (res["data"]["result"]) {
        this.excelService.exportAsExcelFile(
          res["data"]["result"],
          "expiredGoodsReport"
        );
      } else {
        alert("This request can not be completed right now, Please try again"); //no data found in this.reportInfo object
      }
    });
  }

  /*
  Method For Changing The Pagination
*/
  changePage(event: MatPaginator) {
    this.pageOptionsOnChange = event;
    if (this.total == 0) {
    }
    this.getInventoryReport();
  }
}
