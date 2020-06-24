import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpServices } from "../../http-service";
// import { Angular2Csv } from 'angular2-csv/Angular2-csv';
// import { PERSONS, Person } from '../../shared/components/helper/model';
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
  selector: "app-expired-goods-report",
  templateUrl: "./expired-goods-report.component.html",
  styleUrls: ["./expired-goods-report.component.scss"],
  animations: [routerTransition()]
})
export class ExpiredGoodsReportComponent extends Pagination implements OnInit {
  reportInfo: any;
  dataFlag: boolean;
  noDataText: any;
  // persons: Person[];

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    super();
    this.excelService = excelService;
    // this.persons = PERSONS;
    this.getIExpiredGoodsReport();
  }

  ngOnInit() {
    if (this.userRoleCheck("expired_report", "read") == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  getIExpiredGoodsReport() {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));

    let userID = userDetails.sysUser_ID;
    let param = {
      p_store_ID: userDetails.store_ID,
      userID: userID,
      ...this.validPageOptions
    };

    this.httpServices.expiredGoodsReport(param).then((response: any) => {
      if (response.data.code === 0) {
        this.dataFlag = true;
        this.reportInfo = response.data.result;
        this.total = response.data.result[0]["totalRecord"];
      } else {
        this.dataFlag = false;
        this.noDataText = "Data Not found";
      }
    });
  }

  exportToExcel(event) {
    var query;
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails.code === "SADM") {
      query = `select * from  tbl_product where isDeleted = 0 and ExpiryDate < NOW()`;
    } else {
      query = `select * from  tbl_product where isDeleted = 0 and Store_ID =${userDetails.store_ID} and ExpiryDate < NOW()`;
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
    this.getIExpiredGoodsReport();
  }
}
