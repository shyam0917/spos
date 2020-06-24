import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpServices } from "../../http-service";
import { ExcelService } from "../../shared/components/helper/excel.service";
import { UserDetails } from "../../modals/app.interface";
import { Storage } from "../../modals/app.class";
import { UserRoleChecker } from "../../user-role-service";
import { Location } from "@angular/common";

@Component({
  selector: "app-transaction-report",
  templateUrl: "./transaction-report.component.html",
  styleUrls: ["./transaction-report.component.scss"],
  animations: [routerTransition()]
})
export class TransactionReportComponent implements OnInit {
  transactionInfo: any;
  user: UserDetails;
  duration: any = [];
  invoiceIndexGlobal: number = -1;
  showInvoiceToggle: boolean = false;
  invoiceData: any = [];
  dataFlag: boolean;

  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private storage: Storage,
    private location: Location,
    private userRoleChecker: UserRoleChecker
  ) {
    this.excelService = excelService;
    this.user = this.storage.getObject("userDetails");
    this.transactionReportFun("Monthly");
    this.duration = ["Monthly", "Yearly", "Weekly", "Hourly"];
  }

  ngOnInit() {
    if (this.userRoleCheck("transaction_report", "read") == false) {
      this.location.back();
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // Transaction Reports

  noDataText: any = "";
  transactionReportFun(val) {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let userID = userDetails.sysUser_ID;

    let param = {
      p_store_ID: this.user.store_ID,
      p_queryType: val, // 'Monthly',"Yearly","Weekly","Hourly",
      userID: userID
    };
    // console.log("param---->", param);
    this.httpServices.transactionReport(param).then((response: any) => {
      // console.log("response", response);
      if (response.data.code === 0) {
        this.dataFlag = true;
        this.transactionInfo = response.data.result;
        // console.log("this.transactionInfo", this.transactionInfo);
      } else {
        this.dataFlag = false;
        this.noDataText = "Data Not found";
      }
    });
  }

  invoiceToggle(index: number) {
    if (this.showInvoiceToggle) {
    }
    this.invoiceIndexGlobal = index;
    this.showInvoiceToggle = !this.showInvoiceToggle;
    this.getInvoice(this.transactionInfo[index].transaction_ID);
  }

  getInvoice(txnId: number) {
    let params = {
      p_store_ID: this.user.store_ID,
      p_transaction_ID: txnId
    };
    this.httpServices.getInvoiceDetails(params).then(
      (data: any) => {
        this.invoiceData = [];

        if (data.data.code === 0) {
          // this.dataFlag = false;
          this.invoiceData = data.data.result;
        } else {
          // this.dataFlag = true;
          this.noDataText = "Data Not found";
        }
      },
      err => {
        console.log("err", err);
      }
    );
  }

  exportToExcel(event) {
    if (this.transactionInfo) {
      this.excelService.exportAsExcelFile(
        this.transactionInfo,
        "transactionReport"
      );
    } else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.transactionInfo object
    }
  }

  onSelectChange(val) {
    // console.log('val', val);
    this.transactionReportFun(val);
  }
}
