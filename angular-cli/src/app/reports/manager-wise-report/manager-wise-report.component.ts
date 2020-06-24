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
@Component({
  selector: "app-manager-wise-report",
  templateUrl: "./manager-wise-report.component.html",
  styleUrls: ["./manager-wise-report.component.scss"],
  animations: [routerTransition()]
})
export class ManagerWiseReportComponent extends Pagination implements OnInit {
  managerWiseReportInfo: any;
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
    this.managerWiseReportFun();
  }

  ngOnInit() {
    if (this.userRoleCheck("manager_wise_report", "read") == false) {
      this.location.back();
    }
  }


  noDataText: any = "";
  loginInfo: any;

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  managerWiseReportFun() {
    this.loginInfo = this.storage.getObject("userDetails");
    var param = {
      p_store_ID: this.loginInfo.store_ID,
      p_role: "ADM",
      ...this.validPageOptions
    };
    this.httpServices.managerWiseReport(param).then((response: any) => {
      if (response.data.code === 0) {
        this.dataFlag = 1;
        // this.managerWiseReportInfo = response.data.result;
        let tempData = response.data.result;
        this.total = response.data.result[0].totalRecord;
        tempData.forEach((element, i) => {
          // 2 Jan 2020  by Aman Tyagi
          switch (element.role) {
            case "SADM":
              tempData[i].role = "Super Admin";
              break;
            case "ADM":
              tempData[i].role = "Admin";
              break;
            case "ACM":
              tempData[i].role = "Account Manager";
              break;
            case "STRADM":
              tempData[i].role = "Store Admin";
              break;
            case "STRMAG":
              tempData[i].role = "Store Manager";
              break;
            case "STRUSR":
              tempData[i].role = "Store User";
              break;
            case "SYSUSR":
              tempData[i].role = "System User";
              break;
            default:
              tempData[i].role = "Unknown";
          }
        });
        this.managerWiseReportInfo = tempData;
        // console.log(this.managerWiseReportInfo);
      } else {
        this.dataFlag = 2;
        this.noDataText = "Data Not found";
      }
    });
  }

  exportToExcel(event) {
    var query;
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails.code === "SADM") {
      query = `select sysUser_ID, store_ID, role, firstName, middleName , lastName, email , userName , password , mobile , emergencyContact , role_ID , name , access_ID  from tbl_sysuser tsu join tbl_roles tr on tsu.role = tr.code where tsu.isDeleted = 0`;
    } else {
      query = `select sysUser_ID, store_ID, role, firstName, middleName , lastName, email , userName , password , mobile , emergencyContact , role_ID , name , access_ID from tbl_sysuser tsu join tbl_roles tr on tsu.role = tr.code where tsu.isDeleted = 0 and tsu.store_ID = ${userDetails.store_ID} and tsu.role = "${userDetails.code}"`;
    }
    this.httpServices.expiredGoodsReportForExcel(query).subscribe(res => {
      if (res["data"]["result"]) {
        this.excelService.exportAsExcelFile(
          res["data"]["result"],
          "managerWiseReport"
        );
      } else {
        alert("This request can not be completed right now, Please try again"); //no data found in this.managerWiseReportInfo object
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
    this.managerWiseReportFun();
  }
}
