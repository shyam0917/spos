import { Injectable } from '@angular/core';
import { ConstantValues } from './constant-values';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class HttpServices {
  services: any;
  data: any;
  dataCount: any;
  constructor(private constantValues: ConstantValues, public http: HttpClient, private router: Router) {
    this.services = this.constantValues.urls;
  }
  login(login: string) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'user': login })
    };

    return new Promise(resolve => {
      this.http.post(this.services.loginUrl, {}, httpOptions)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  register(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return new Promise(resolve => {
      this.http.post(this.services.registerUrl, body, httpOptions)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
  forgetUser(obj) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.services.forgotPasswardUrl, obj, httpOptions);

  }
  resetPassword(obj) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.services.resetPassUrl, obj, httpOptions);

  }

  updatePassword(obj) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.services.updateNewPgetProductassUrl, obj, httpOptions);

  }
  getGst(info) {

    return this.http.post(this.services.getGstTableUrl, info);
  }
  getAllStoreId() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.services.getAllStoreIdUrl, {}, httpOptions);

  }
  check_email(mail: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return new Promise(resolve => {
      this.http.post(this.services.check_emailUrl, mail, httpOptions)
        .subscribe(mail_data => {
          this.data = mail_data;
          resolve(this.data);
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "check_email", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  check_user(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.check_userUrl, user, httpOptions)
        .subscribe(user_data => {
          this.data = user_data;
          resolve(this.data);
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "check_user", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  // for create store
  create_store(storeInfo: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return new Promise(resolve => {
      this.http.post(this.services.create_storeUrl, storeInfo, httpOptions)
        .subscribe((store_data: any) => {
          if (store_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.data = store_data;
            resolve(this.data);
          }

        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "create_store", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  // for create category
  create_category(categoryInfo: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return new Promise(resolve => {
      this.http.post(this.services.create_categoryUrl, categoryInfo, httpOptions)
        .subscribe((category_data: any) => {

          if (category_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {

            this.data = category_data;
            resolve(this.data);
          }

        },
          (error: any) => {
            let date = new Date();
            let object = {
              "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss()
            }
            this.sendErrrLog(object);
          });
    });
  }

  create_subcategory(subcategoryInfo: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return new Promise(resolve => {
      this.http.post(this.services.create_subcategoryUrl, subcategoryInfo, httpOptions)
        .subscribe((subcategory_data: any) => {

          if (subcategory_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.data = subcategory_data;
            resolve(this.data);
          }

        },
          (error: any) => {
            let date = new Date();
            let object = {
              "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss()
            }
            this.sendErrrLog(object);
          });
    });
  }

  update_store(storeInfo: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return new Promise(resolve => {
      this.http.post(this.services.update_storeUrl, storeInfo, httpOptions)
        .subscribe((store_data: any) => {
          if (store_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.data = store_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "update_store", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  fetch_store(obj) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.getStore, { 'userID': obj.userID, 'obj': obj }, httpOptions)
        .subscribe((store_data: any) => {
          if (store_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.data = store_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "fetch_store", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  delete_store(id) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.deleteStore, { "store_ID": id }, httpOptions)

        .subscribe((store_response: any) => {
          if (store_response.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.data = store_response;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "delete_store", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  check_store(storeInfo: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.check_storeUrl, storeInfo, httpOptions)

        .subscribe((store_response: any) => {
          if (store_response.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.data = store_response;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "check_store", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  getManagers(id) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return new Promise(resolve => {
      this.http.post(this.services.getManager, { info: id }, httpOptions)
        .subscribe((store_managers: any) => {
          if (store_managers.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.data = store_managers;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "getManagers", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  deleteManager(id) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return new Promise(resolve => {
      this.http.post(this.services.deleteManager, { "sysUser_ID": id }, httpOptions)

        .subscribe((store_response: any) => {

          if (store_response.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = store_response;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "deleteManager", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  addUpdateProduct(info: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.addUpdateProductUrl, info, httpOptions)
        .subscribe((product_data: any) => {
          if (product_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.data = product_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "addUpdateProduct", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  getProduct(info: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.getProductUrl, info, httpOptions)

        .subscribe((getProduct_data: any) => {
          if (getProduct_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = getProduct_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "getProduct", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  getProductCount(info: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.getProductCountUrl, info, httpOptions)

        .subscribe((getProductCount_data: any) => {
          // if (getProductCount_data.success == false) {
          //   localStorage.clear();
          //   this.router.navigate(['/login']);
          // }
          if (getProductCount_data.status == 'Success') {
            this.dataCount = getProductCount_data.data
            resolve(this.dataCount);
          }
        },
          (error: any) => {
            this.sendErrrLog(error);
          });
    });
  }

  getCountAboutOutofStock() {
    return new Promise(resolve => {
      this.http.get(this.services.getCountAboutOutofStock)
        .subscribe((aboutOutofStockCount_data: any) => {
          // if (getProductCount_data.success == false) {
          //   localStorage.clear();
          //   this.router.navigate(['/login']);
          // }
          if (aboutOutofStockCount_data.status == 'Success') {
            // this.dataCount = getProductCount_data.data
            resolve(aboutOutofStockCount_data.data.result);
          }
        },
          (error: any) => {
            this.sendErrrLog(error);
          });
    });
  }

  getCountOutofStock() {
    return new Promise(resolve => {
      this.http.get(this.services.getCountOutofStock)
        .subscribe((OutofStockCount_data: any) => {
          // if (getProductCount_data.success == false) {
          //   localStorage.clear();
          //   this.router.navigate(['/login']);
          // }
          if (OutofStockCount_data.status == 'Success') {
            // this.dataCount = getProductCount_data.data
            resolve(OutofStockCount_data.data.result);
          }
        },
          (error: any) => {
            this.sendErrrLog(error);
          });
    });
  }

  deleteProduct(info: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.deleteProductUrl, info, httpOptions)

        .subscribe((deleteProduct_data: any) => {
          if (deleteProduct_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = deleteProduct_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "deleteProduct", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  // gstItems() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  //   };
  //   return new Promise(resolve => {
  //     this.http.get(this.services.gstItemsUrl)

  //       .subscribe(gst_data => {
  //         this.data = gst_data;
  //         resolve(this.data);
  //       });
  //   });
  // }

  transactionReport(info: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.transactionReportUrl, info, httpOptions)

        .subscribe((transaction_data: any) => {
          if (transaction_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = transaction_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "transactionReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  getInvoiceDetails(info: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.getInvoiceDetailUrl, info, httpOptions)

        .subscribe((invoice_data: any) => {
          if (invoice_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = invoice_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "getInvoiceDetails", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  expiredGoodsReportForExcel(info){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(this.services.exportToExcel, {info}, httpOptions)
  }

  expiredGoodsReport(info: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.expiredGoodsUrl, info, httpOptions)
        .subscribe((expiredGoods_data: any) => {
          if (expiredGoods_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = expiredGoods_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "expiredGoodsReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  cashReport(info: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return new Promise(resolve => {
      this.http.post(this.services.cashReportUrl, info, httpOptions)

        .subscribe((cashReport_data: any) => {
          if (cashReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = cashReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "cashReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  salesReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.salesReportUrl, info, httpOptions)

        .subscribe((salesReport_data: any) => {
          if (salesReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = salesReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "salesReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  customerReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.customerReportUrl, info, httpOptions)

        .subscribe((customerReport_data: any) => {
          if (customerReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = customerReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "customerReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  userBillReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.userBillReportUrl, info, httpOptions)

        .subscribe((userBillReport_data: any) => {
          if (userBillReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = userBillReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "userBillReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  billTaxReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.billTaxReportUrl, info, httpOptions)

        .subscribe((billTaxReport_data: any) => {
          if (billTaxReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = billTaxReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "billTaxReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  voidBillReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.voidBillReportUrl, info, httpOptions)

        .subscribe((voidBillReport_data: any) => {
          if (voidBillReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = voidBillReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "voidBillReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  returnedItemReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.returnedItemReportUrl, info, httpOptions)

        .subscribe((returnedItemReport_data: any) => {
          if (returnedItemReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = returnedItemReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "returnedItemReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  stockReport(limit = 0, skip = 0) {
    let obj = {
      lim: limit,
      ski: skip
    }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.stockReportUrl, obj, httpOptions)

        .subscribe((stock_data: any) => {
          if (stock_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = stock_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "stockReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  outOfStockReport(info) {
    console.log(info,"info")
  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
 
    return new Promise(resolve => {
      this.http.post(this.services.outOfStockReportUrl, info, httpOptions)

        .subscribe((outOfStock_data: any) => {
          if (outOfStock_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = outOfStock_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "outOfStockReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }

  aboutOutOfStockReport(limit = 5, skip = 0) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let obj = {
      lim: limit,
      ski: skip
    }
    return new Promise(resolve => {
      this.http.post(this.services.aboutOutOfStockReportUrl, obj, httpOptions)

        .subscribe((outOfStock_data: any) => {
          if (outOfStock_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = outOfStock_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "aboutOutOfStockReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          });
    });
  }


  profitReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.profitReportUrl, info, httpOptions)

        .subscribe((profitReport_data: any) => {
          if (profitReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = profitReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "profitReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  returnedCashReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.returnedCashReportUrl, info, httpOptions)

        .subscribe((returnedCashReport_data: any) => {
          if (returnedCashReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = returnedCashReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "returnedCashReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  storeWiseReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.storeWiseReportUrl, info, httpOptions)

        .subscribe((storeWiseReport_data: any) => {
          if (storeWiseReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = storeWiseReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "storeWiseReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  allStoreReport(info) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.allStoreReportUrl, {}, httpOptions)

        .subscribe((allStoreReport_data: any) => {
          if (allStoreReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = allStoreReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "allStoreReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  expenseReport(info) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.expenseReportUrl, {}, httpOptions)

        .subscribe((expenseReport_data: any) => {
          if (expenseReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = expenseReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "expenseReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  managerWiseReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.managerWiseReportUrl, info, httpOptions)

        .subscribe((managerWiseReport_data: any) => {
          if (managerWiseReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = managerWiseReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "managerWiseReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  sellUsingCardReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.sellUsingCardReportUrl, info, httpOptions)

        .subscribe((sellUsingCardReport_data: any) => {
          if (sellUsingCardReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = sellUsingCardReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "sellUsingCardReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  gstReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.gstReportUrl, info, httpOptions)
        .subscribe(gstReport_data => {
          this.data = gstReport_data;
          resolve(this.data);
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "gstReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  specialDiscountReport(info: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.specialDiscountReportUrl, info, httpOptions)

        .subscribe((specialDiscountReport_data: any) => {
          if (specialDiscountReport_data.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = specialDiscountReport_data;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "specialDiscountReport", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  getUoms() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.uoms, {}, httpOptions)

        .subscribe((uoms: any) => {
          if (uoms.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = uoms;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "getUoms", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  getList(type) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.list, { "type": type }, httpOptions)
        .subscribe((uoms: any) => {
          if (uoms.success == false) {
            resolve(this.data)
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.data = uoms;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "getList", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  // js_yyyy_mm_dd_hh_mm_ss () {
  //   let now = new Date();
  //   let year = "" + now.getFullYear();
  //   let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  //   let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  //   let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  //   let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  //   let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  //   return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  // }

  // generatePrimaryKey(store_ID, user_ID) {
  //   let storeID = "00000000" + store_ID + "" + user_ID;
  //   let storeID8Digits = storeID.substr(storeID.length - 8);
  //   let primaryKey = storeID8Digits + Date.now();
  //   return String(primaryKey);
  // }

  getRoles() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.roles, {}, httpOptions)

        .subscribe((roles: any) => {
          if (roles.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = roles;
            resolve(this.data);
          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": JSON.stringify(logID), "methodName": "getRoles", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  fetch_categoryStore() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.categorystore, {}, httpOptions)
        .subscribe((category: any) => {

          if (category.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = category;
            resolve(this.data);
          }

        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": JSON.stringify(logID), "methodName": "fetch_categoryStore", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })

  }

  // Subcategory Starts
  fetch_subcategoryStore(categoryID) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.subcategorystore, { category_ID: categoryID }, httpOptions)
        .subscribe((subcategory: any) => {

          if (subcategory.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = subcategory;
            resolve(this.data);
          }

        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": JSON.stringify(logID), "methodName": "fetch_subcategoryStore", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })

  }
  // Subcategory Ends

  sendErrrLog(logs) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.errorlog, { logArray: [logs] }, httpOptions)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  addDeviceStatus(deviceStatus) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.addDeviceStatus, deviceStatus, httpOptions)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  addPOS(pos) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.addPos, pos, httpOptions)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  fetchPOS(obj) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.fetchPos, { 'userID': obj.userID }, httpOptions)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  editPOS(pos) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.editPos, pos, httpOptions)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  deletePOS(pos_id) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


    return new Promise(resolve => {
      this.http.post(this.services.deletePos, pos_id, httpOptions)
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  getGstCategory() {
    return this.http.get(`${this.services.gstcategory}`);
  }

  // setGstTable(){
  //   return this.http.post(`${this.services.setGstTable}`);
  // }
  setGstTable(pos) {
    return this.http.post(this.services.setGstTable, pos)
  }
  addUoms(uom) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return new Promise(resolve => {
      this.http.post(this.services.adduoms, { uom }, httpOptions)

        .subscribe((uoms: any) => {
          if (uoms.success == false) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else {
            this.data = uoms;
            resolve(this.data);

          }
        },
          (error: any) => {
            let loginInfoVar = JSON.parse(localStorage.getItem("userDetails"));
            let p_storeID = loginInfoVar.store_ID;
            let p_sysUser_ID = loginInfoVar.sysUser_ID;
            let logID = this.constantValues.log.generatePrimaryKey(p_storeID, p_sysUser_ID);
            let date = new Date();

            let object = {
              "log_ID": logID, "methodName": "getUoms", "className": "http-service", "errorMessage": JSON.stringify(error), "createdOn": this.constantValues.log.js_yyyy_mm_dd_hh_mm_ss(), "store_ID": p_storeID
            }
            this.sendErrrLog(object);
          })
    })
  }

  getStateData() {
    return this.http.get(this.services.getStatesUrl);
  }
  getPinInfo(pin) {
    return this.http.post(this.services.getPinInfoUrl,{pin:pin});
  }
  getCitiesData(key) {
    return this.http.post(this.services.getCitiesUrl, { key: key });
  }

  sendImages(formData) {
    return this.http.post(this.services.uploadMultipleImagesUrl, formData);
  }

}

