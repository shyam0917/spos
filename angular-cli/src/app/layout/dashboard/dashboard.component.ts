import { Component, OnInit, HostListener } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { HttpServices } from "../../http-service";
import { UserRoleChecker } from "../../user-role-service";
import { NgForm } from "@angular/forms";
import { ViewChild, ElementRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { DOCUMENT } from '@angular/common';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';   //added 09-august regan
declare var Highcharts: any;
declare var alertify: any; //09-august regan

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
  public alerts: Array<any> = [];
  public sliders: Array<any> = [];

  public sumOutofStock: Number;
  public sumExpense: Number;
  public sumSales: Number;
  public sumStock: Number;

  message: string = "";
  @ViewChild("closeBtn") closeBtn: ElementRef;
  expBtnVisible;
  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  screenChange(event) {
    this.expBtnVisible = !this.expBtnVisible;
    Highcharts.charts[0].update({
      exporting: {
        buttons: {
          contextButton: {
            enabled: this.expBtnVisible
          }
        }
      }
    })
    Highcharts.charts[1].update({
      exporting: {
        buttons: {
          contextButton: {
            enabled: this.expBtnVisible
          }
        }
      }
    })
    Highcharts.charts[0].reflow();
    console.log(this.expBtnVisible);
  }

  constructor(
    public httpServices: HttpServices,
    private fb: FormBuilder,
    public userRoleChecker: UserRoleChecker // private modalService: NgbModal
  ) {
    this.expBtnVisible = true;
  }

  ngOnInit() {
    // this.fetchPOS();
    console.log(this.expBtnVisible);
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));

    let userID = userDetails.sysUser_ID;

    let param = {
      p_store_ID: userDetails.store_ID,
      p_queryType: "Yearly",
      userID: userID // 'Monthly',"Yearly","Weekly","Hourly",
    };
    // console.log("param---->", param);
    let env = this;
    expenseCount();
    fetchStockCount();
    salesCount();
    fetchOutofStockCount();
    transactionGraph();

    function fetchStockCount() {
      let userDetails = JSON.parse(localStorage.getItem("userDetails"));
      let userID = userDetails.sysUser_ID;
      let store_ID = userDetails.store_ID;
      let paramObj = {
        p_store_ID: store_ID, //this.loginInfo.store_ID,
        userID: userID
      };
      env.httpServices.stockReport().then((response: any) => {
        let arr = [];
        if (response.data.code === 0) {
          env.sumStock = response.data.result.length;
          // arr = response.data.result.map(stock => {
          //   return stock.totalstock;
          // });
          // for (let i = 0; i < arr.length; i++) {
          //   env.sumStock += arr[i];
          // }
        } else {
        }
      });
    }

    function salesCount() {
      env.httpServices.salesReport(param).then((response: any) => {
        let arr = [];
        if (response.data.code === 0) {
          arr = response.data.result.map(stock => {
            return JSON.parse(stock.totalAmount);
          });
          for (let i = 0; i < arr.length; i++) {
            if (env.sumSales == undefined) {
              env.sumSales = 0;
            }
            env.sumSales += arr[i];
          }
        } else {
        }
      });
    }

    function expenseCount() {
      env.httpServices.expenseReport(1234).then((response: any) => {
        let arr = [];
        if (response.data.code === 0) {
          arr = response.data.result.map(stock => {
            return stock.amount;
          });
          for (let i = 0; i < arr.length; i++) {
            if (env.sumExpense == undefined) {
              env.sumExpense = 0;
            }
            env.sumExpense += arr[i];
          }
        } else {
        }
      });
    }

    function fetchOutofStockCount() {
      let userDetails = JSON.parse(localStorage.getItem("userDetails"));
      let userID = userDetails.sysUser_ID;
      let store_ID = userDetails.store_ID;
      let paramObj = {
        p_store_ID: store_ID, //this.loginInfo.store_ID,
        userID: userID
      };
      env.httpServices.expiredGoodsReport(paramObj).then((response: any) => {
        let arr = [];
        // console.log("sagdyguads", response);
        if (response.data.code === 0) {
          env.sumOutofStock = response.data.result.length;
          // arr = response.data.result.map(stock => {
          //   return stock.totalstock;
          // });
          // for (let i = 0; i < arr.length; i++) {
          //   env.sumOutofStock += arr[i];
          // }
        } else {
        }
      });
    }

    function transactionGraph() {
      env.httpServices.transactionReport(param).then((response: any) => {
        if (response.data.code === 0) {
          let resData = response.data.result;

          let returnUTC = function (date: Date) {
            return Date.UTC(
              new Date(date).getFullYear(),
              new Date(date).getMonth(),
              new Date(date).getDate()
            );
          };

          let graphTempData = resData.map(function (data) {
            return {
              store_ID: data.store_ID,
              data: [returnUTC(data.createdOn), JSON.parse(data.totalAmount)]
            };
          });

          let tempData = graphTempData.map(function (data) {
            return data.store_ID;
          });

          let uniqueStores = Array.from(new Set(tempData));
          // console.log('unique', uniqueStores);

          let GraphDataTransaction = [];

          uniqueStores.forEach(store => {
            let filterData = graphTempData.filter(function (data) {
              return data.store_ID == store;
            });
            GraphDataTransaction.push(
              GraphPlotterTransaction(filterData, store)
            );
          });


          Highcharts.chart("transaction-graph", {
            chart: {
              type: "spline"
            },
            title: {
              text: "Transaction Report"
            },
            xAxis: {
              type: "datetime",
              dateTimeLabelFormats: {
                // don't display the dummy year
                month: "%e. %b",
                year: "%b"
              },
              title: {
                text: "Date"
              }
            },
            yAxis: {
              title: {
                text: "Total Amount"
              },
              min: 0
            },
            tooltip: {
              headerFormat: "<b>Transaction</b><br>",
              pointFormat: "{point.x:%e. %b}: <b>Rs.</b>{point.y:.2f}"
            },

            plotOptions: {
              spline: {
                marker: {
                  enabled: true
                },
                dataLabels: {
                  enabled: true
                }
              }
            },


            series: GraphDataTransaction,
            exporting: {
              scale: 2,
              width: 450,
              allowHTML: true,
              buttons: {
                contextButton: {
                  menuItems: [
                    {
                      textKey: 'viewFullscreen',
                      onclick: function () {
                        new Highcharts.FullScreen(this.container);
                        Highcharts.charts[0].update({
                          exporting: {
                            buttons: {
                              contextButton: {
                                enabled: false
                              }
                            }
                          }
                        })
                      }

                    }
                    , 'printChart', 'downloadPNG', 'downloadPDF'],
                }
              }

            }

          });
        }
      });

      env.httpServices.salesReport(param).then((response: any) => {
        if (response.data.code === 0) {
          let resData = response.data.result;

          let returnUTC = function (date: Date) {
            return Date.UTC(
              new Date(date).getFullYear(),
              new Date(date).getMonth(),
              new Date(date).getDate()
            );
          };

          let graphTempData = resData.map(function (data) {
            return {
              store_ID: data.store_ID,
              data: [returnUTC(data.createdOn), JSON.parse(data.totalAmount)]
            };
          });

          let tempData = graphTempData.map(function (data) {
            return data.store_ID;
          });

          let uniqueStores = Array.from(new Set(tempData));
          let GraphDataTransaction2 = [];

          uniqueStores.forEach(store => {
            let filterData = graphTempData.filter(function (data) {
              return data.store_ID == store;
            });
            GraphDataTransaction2.push(
              GraphPlotterTransaction(filterData, store)
            );
          });

          Highcharts.chart("sales-graph", {
            chart: {
              type: "spline"
            },
            title: {
              text: "Sales Report"
            },
            xAxis: {
              type: "datetime",
              dateTimeLabelFormats: {
                // don't display the dummy year
                month: "%e. %b",
                year: "%b"
              },
              title: {
                text: "Date"
              }
            },
            yAxis: {
              title: {
                text: "Total Amount"
              },
              min: 0
            },
            tooltip: {
              headerFormat: "<b>Sales</b><br>",
              pointFormat: "{point.x:%e. %b}: <b>Rs.</b>{point.y:.2f}"
            },

            plotOptions: {
              spline: {
                marker: {
                  enabled: true
                },
                dataLabels: {
                  enabled: true
                }
              }
            },

            series: GraphDataTransaction2,
            exporting: {
              scale: 2,
              width: 450,
              allowHTML: true,
              buttons: {
                contextButton: {
                  menuItems: [{
                    textKey: 'viewFullscreen',
                    onclick: function () {
                      new Highcharts.FullScreen(this.container);
                      Highcharts.charts[1].update({
                        exporting: {
                          buttons: {
                            contextButton: {
                              enabled: false
                            }
                          }
                        }
                      })
                    }

                  }
                    , 'printChart', 'downloadPNG', 'downloadPDF']
                }
              }
            }
          });
        }
      });
    }

    function GraphPlotterTransaction(filterData, store) {
      // console.log('filter', filterData, store);

      let GraphData = filterData.map(function (dataGraph) {
        return dataGraph.data;
      });

      let newTempData = GraphData.map(data => {
        return data[0];
      });

      let distinctTimeArray = Array.from(new Set(newTempData));

      let FinalGraphData = [];

      for (let i = 0; i < distinctTimeArray.length; i++) {
        let sum = 0;
        for (let j = 0; j < GraphData.length; j++) {
          if (distinctTimeArray[i] == GraphData[j][0]) {
            sum += GraphData[j][1];
          }
        }
        FinalGraphData.push([distinctTimeArray[i], sum]);
      }

      return {
        data: FinalGraphData,
        name: "Store " + store
      };
    }
  }

  // form for reset password
  resetPassForm = this.fb.group({
    currentPass: [""],
    newPass: [""],
    confirmPass: [""]
  });

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // submitting reset-password form
  onSubmit() {
    if (
      this.resetPassForm.value.newPass == "" ||
      this.resetPassForm.value.newPass == null ||
      this.resetPassForm.value.newPass == undefined ||
      this.resetPassForm.value.currentPass == "" ||
      this.resetPassForm.value.currentPass == null ||
      this.resetPassForm.value.currentPass == undefined ||
      this.resetPassForm.value.confirmPass == "" ||
      this.resetPassForm.value.confirmPass == null ||
      this.resetPassForm.value.confirmPass == undefined
    ) {
      this.message = "Please fill all the fields";
      setTimeout(() => {
        this.message = "";
      }, 1000);
    } else {
      if (
        localStorage.getItem("isLoggedin") &&
        JSON.parse(localStorage.getItem("isLoggedin"))
      ) {
        if (
          this.resetPassForm.value.newPass ==
          this.resetPassForm.value.confirmPass
        ) {
          let user = JSON.parse(localStorage.getItem("userDetails"));
          let data = {
            userName: user.userName,
            passData: this.resetPassForm.value
          };
          this.httpServices.resetPassword(data).subscribe(
            result => {
              this.message = result["msg"];
              setTimeout(() => {
                this.message = "";
              }, 1000);
              alertify.success(this.message);
              this.resetPassForm.reset();
              this.closeBtn.nativeElement.click();
            },
            error => {
              this.message = error.error.msg;
            }
          );
        } else {
          this.message = "Confirm password not matched";
        }
      } else {
        this.message = "Login again";
      }
    }
  }

  // on Modal close
  onClose() {
    this.resetPassForm.reset();
  }

  // addPOS(POS) {
  //   // console.log('pos', POS);

  //   let pos = {
  //     p_store_ID: POS.store_id,
  //     p_pos_ID: POS.pos_id
  //   }

  //   this.addPosFlag = false;
  //   this.addPosFlagFail = false;
  //   // alert(JSON.stringify(user));
  //   this.httpServices.addPOS(pos)
  //     .then((response: any) => {
  //       // console.log('pos response', response);
  //       if (response.code == 0) {
  //         this.store_id = undefined;
  //         this.pos_id = undefined;
  //         this.addPosFlag = false;      //edited 09-august regan
  //         alertify.success('POS device added successfully');
  //         this.fetchPOS();
  //       } else {
  //         this.addPosFlagFail = true;
  //       }
  //     }).catch((err) => {
  //       this.addPosFlagFail = true;
  //     });
  // }

  // fetchPOS() {
  //   this.httpServices.fetchPOS()
  //     .then((response: any) => {
  //       this.pos_list = response.data.result;
  //       // console.log("final", this.pos_list);
  //     });
  // }

  // editPOSForm(pos) {
  //   this.addPosForm = false;
  //   this.data = pos;
  // }

  // editPOS(POS) {
  //   let pos = {
  //     p_store_ID: POS.Store_ID,
  //     p_pos_ID: POS.pos_ID,
  //     p_tbl_store_pos_ID: this.data.tbl_store_pos_ID
  //   }
  //   this.addPosFlag = false;
  //   this.addPosFlagFail = false;
  //   // alert(JSON.stringify(user));
  //   this.httpServices.editPOS(pos)
  //     .then((response: any) => {
  //       // console.log('edit pos response', response);
  //       if (response.code == 0) {
  //         this.editPosFlag = true;
  //         this.data = {};
  //         this.addPosForm = true;
  //         this.editPosFlag = false;
  //         alertify.success('POS device edited successfully!');
  //         this.fetchPOS();
  //       } else {
  //         this.editPosFlagFail = true;
  //       }
  //     }).catch((err) => {
  //       this.editPosFlagFail = true;
  //     });
  // }

  // deletePOS(pos) {
  //   // console.log('id', pos);

  //   let delPos = {
  //     p_tbl_store_pos_ID: pos.tbl_store_pos_ID
  //   }

  //   this.httpServices.deletePOS(delPos)
  //     .then((response) => {
  //       alertify.success('POS device deleted successfully!');
  //       this.fetchPOS();
  //     })
  // }

  // closeResult: string;
  // strorePOS_IDForstorePosDeleteModal: any;
  // storeNameForstorePosDeleteModal: any;
  // openDeletePosID(storePosDelete, POS) {
  //   this.strorePOS_IDForstorePosDeleteModal = POS.pos_ID;
  //   this.storeNameForstorePosDeleteModal = POS.storeName;

  //   this.modalService.open(storePosDelete).result.then(
  //     result => {
  //       this.deletePOS(POS);
  //     },
  //     reason => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     }
  //   );
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return "by pressing ESC";
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return "by clicking on a backdrop";
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
}
