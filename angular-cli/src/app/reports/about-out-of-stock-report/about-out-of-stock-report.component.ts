import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpServices } from "../../http-service";
import { ExcelService } from "../../shared/components/helper/excel.service";
import { UserRoleChecker } from "../../user-role-service";
import { Location } from "@angular/common";

@Component({
  selector: "app-about-out-of-stock-report",
  templateUrl: "./about-out-of-stock-report.component.html",
  styleUrls: ["./about-out-of-stock-report.component.scss"],
  animations: [routerTransition()]
})
export class AboutOutOfStockReportComponent implements OnInit {
  aboutOutOfStockReportInfo: any;
  limit = 5;
  offset;
  count;
  dataFlag: boolean;

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private userRoleChecker: UserRoleChecker,
    private location: Location
  ) {
    this.excelService = excelService;
  }

  ngOnInit() {
    if (this.userRoleCheck("about_out_of_stock_report", "read") == false) {
      this.location.back();
    }
    this.aboutOutOfStock(5, 0);
    this.countOfaboutOutOfStock();
  }

  aboutOutOfStock(lim, ski) {
    this.httpServices.aboutOutOfStockReport(lim, ski).then((response: any) => {
      if (response.data.code === 0) {
        this.aboutOutOfStockReportInfo = response.data.result;
        this.dataFlag = true;
      } else {
        this.dataFlag = false;
      }
    });
  }

  exportToExcel(event) {
    // if (this.aboutOutOfStockReportInfo) {
    //   this.excelService.exportAsExcelFile(
    //     this.aboutOutOfStockReportInfo,
    //     "aboutOutOfStockReport"
    //   );
    // } else {
    //   alert(
    //     "This request can not be completed right now, Please thandlePaginatorry again"
    //   ); //no data found in this.aboutOutOfStockReportInfo object
    // }
    console.log("Start expel out");

    var query;
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails.code === "SADM") {
      console.log("for admin");
      query = `select product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName,brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, discount, createdOn, modifiedOn, deletedOn, isDeleted as sDeleted, deletedBy, HSN_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock from tbl_product where isDeleted = 0 and totalstock >0 and totalstock <=4`;
    } else {
      console.log("for admin");

      query = `select * from tbl_product where isDeleted = 0 and totalstock >0 and totalstock <=4 and store_ID= 
      ${userDetails.store_ID}`;
      console.log("for admin", query);
    }
    this.httpServices.expiredGoodsReportForExcel(query).subscribe(res => {
      if (res["data"]["result"]) {
        this.excelService.exportAsExcelFile(
          res["data"]["result"],
          "aboutOutOfStockReport"
        );
      } else {
        alert("This request can not be completed right now, Please try again"); //no data found in this.aboutOutOfStockReportInfo object
      }
    });
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }
  countOfaboutOutOfStock() {
    this.httpServices.getCountAboutOutofStock().then((response: any) => {
      this.count = response;
    });
  }
  handlePaginator(data) {
    this.limit = data.pageSize;
    let skip = data.pageIndex ? data.pageIndex * data.pageSize : 0;
    this.aboutOutOfStock(this.limit, skip);
  }
}
