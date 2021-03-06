import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpServices } from '../../http-service';
import { ExcelService } from '../../shared/components/helper/excel.service';
import { UserRoleChecker } from '../../user-role-service';
import { Location } from '@angular/common';
import { Pagination } from '../../modals/pagination';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-all-store-report',
  templateUrl: './all-store-report.component.html',
  styleUrls: ['./all-store-report.component.scss'],
  animations: [routerTransition()]
})
export class AllStoreReportComponent extends Pagination implements OnInit {

  allStoreReportInfo: any;
  dataFlag: boolean;


  constructor(
    public httpServices: HttpServices,
    private excelService: ExcelService,
    private userRoleChecker: UserRoleChecker,
    private location: Location
  ) {
    super();
    this.excelService = excelService;
    this.allStoreReportFun();
  }

  ngOnInit() {
    if (this.userRoleCheck('all_store_report', 'read') == false) {
      this.location.back();
    }
  }


  // Transaction Reports

  noDataText: any = "";

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  allStoreReportFun() {
    let data = {
      ...this.validPageOptions
    }
    this.httpServices.allStoreReport(data)
      .then((response: any) => {
        if (response.data.code === 0) {
          this.dataFlag = true;
          this.allStoreReportInfo = response.data.result;
          this.total = response.data.result[0].totalRecord;
        }
        else {
          this.dataFlag = false;
          this.noDataText = "Data Not found";
        }
      })
  }

  exportToExcel(event) {
    if (this.allStoreReportInfo) {
      this.excelService.exportAsExcelFile(this.allStoreReportInfo, 'allStoreReport');
    }
    else {
      alert("This request can not be completed right now, Please try again"); //no data found in this.allStoreReportInfo object
    }
  }

  /*
  Method For Changing The Pagination
*/
  changePage(event: MatPaginator) {
    this.pageOptionsOnChange = event;
    if (this.total == 0) {
    }
    this.allStoreReportFun();
  }

}
