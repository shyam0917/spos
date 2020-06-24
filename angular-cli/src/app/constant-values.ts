import { Injectable } from "@angular/core";

@Injectable()
export class ConstantValues {
  // private readonly endPoint: string = 'http://192.168.1.112/inventoryApi/app.js';
  //private readonly endPoint: string = "http://127.0.0.1:3000";
  // private readonly endPoint: string = "http://192.168.1.96:3000";
  private readonly endPoint: string = "http://shipgigventures.com:3000";

  public queries: any = {};
  public urls: any = {};
  public dbConfig: any = {};
  public log: any = {};

  constructor() {
    this.setDbConfig();
    this.setQueries();
    this.setUrls();
    this.logFunction();
  }
  private setQueries() {
    this.queries.login = "select * from users";
  }
  private setUrls() {
    // API URLs for Components Began
    this.urls.loginUrl = this.endPoint + "/login";
    this.urls.forgotPasswardUrl = this.endPoint + "/forgotPassward";
    this.urls.updateNewPassUrl = this.endPoint + "/updatePassward";
    this.urls.resetPassUrl = this.endPoint + "/resetPassword";
    this.urls.registerUrl = this.endPoint + "/registration";
    this.urls.check_emailUrl = this.endPoint + "/checkSysEmailexist";
    this.urls.check_userUrl = this.endPoint + "/checkSysUserexist";
    this.urls.create_storeUrl = this.endPoint + "/createstore";
    this.urls.create_categoryUrl = this.endPoint + "/createcategory";
    this.urls.create_subcategoryUrl = this.endPoint + "/createsubcategory";
    this.urls.update_storeUrl = this.endPoint + "/updatestore";
    this.urls.check_storeUrl = this.endPoint + "/checkStoreExist";
    this.urls.addUpdateProductUrl = this.endPoint + "/addUpdateProduct";
    this.urls.getProductUrl = this.endPoint + "/getProduct";
    this.urls.getProductCountUrl = this.endPoint + "/getProductCount";
    this.urls.getCountAboutOutofStock =
      this.endPoint + "/getCountAboutOutofStock";
    this.urls.getCountOutofStock = this.endPoint + "/getCountOutofStock";
    this.urls.deleteProductUrl = this.endPoint + "/deleteProduct";
    this.urls.gstItemsUrl = this.endPoint + "/gstItems";
    this.urls.getStore = this.endPoint + "/getstore";
    this.urls.getAllStoreIdUrl = this.endPoint + "/getAllStoreId";
    this.urls.deleteStore = this.endPoint + "/deletestore";
    this.urls.getManager = this.endPoint + "/getmanagers";
    this.urls.deleteManager = this.endPoint + "/deletemanager";
    this.urls.uoms = this.endPoint + "/uoms";
    this.urls.adduoms = this.endPoint + "/adduoms";
    this.urls.list = this.endPoint + "/list";
    this.urls.roles = this.endPoint + "/role";
    this.urls.verify = this.endPoint + "/verify";
    this.urls.errorlog = this.endPoint + "/errorlog";
    this.urls.addDeviceStatus = this.endPoint + "/add-deviceStatus";
    this.urls.addPos = this.endPoint + "/add-pos";
    this.urls.fetchPos = this.endPoint + "/fetch-pos";
    this.urls.editPos = this.endPoint + "/edit-pos";
    this.urls.deletePos = this.endPoint + "/delete-pos";
    this.urls.gstcategory = this.endPoint + "/gstCategory";
    this.urls.setGstTable = this.endPoint + "/setGstTable";
    this.urls.getGstTableUrl = this.endPoint + "/getGstTable";
    this.urls.getStatesUrl = this.endPoint + "/getStates";
    this.urls.getPinInfoUrl = this.endPoint + "/getPinInfo";
    this.urls.getCitiesUrl = this.endPoint + "/getCities";
    this.urls.uploadMultipleImagesUrl = this.endPoint + "/uploadMultiplemages";

    // API URLs for Components Ends

    // API URLs for Reports Section Began
    this.urls.getInvoiceDetailUrl = this.endPoint + "/getInvoiceDetail"; //Invoice Details
    this.urls.transactionReportUrl = this.endPoint + "/transactionReport"; // Transaction Reports
    this.urls.expiredGoodsUrl = this.endPoint + "/expiredGoods"; // Aged Inventory Report (Expired Goods)
    this.urls.cashReportUrl = this.endPoint + "/cashSummary"; // Cash Summary Report (Sell) (Monthly, weekly, Daily, Yearly, etc.)
    this.urls.salesReportUrl = this.endPoint + "/salesReport"; //  Sales Report (Monthly, weekly, Daily, Hourly, Yearly, etc.)
    this.urls.customerReportUrl = this.endPoint + "/customerReport"; // Customer wise Report
    this.urls.userBillReportUrl = this.endPoint + "/userBillReport"; // User Billed Report(Current User- Single bill)
    this.urls.billTaxReportUrl = this.endPoint + "/billTaxReport"; // Bill/Transaction Tax Report
    this.urls.voidBillReportUrl = this.endPoint + "/voidBillReport"; // Void Bill Report
    this.urls.returnedItemReportUrl = this.endPoint + "/returnedItemReport"; //  Returned Item Report
    this.urls.stockReportUrl = this.endPoint + "/stockReport"; // Inventory(Stock Report)
    this.urls.outOfStockReportUrl = this.endPoint + "/outOfStockReport"; //  Out of Stock Report
    this.urls.aboutOutOfStockReportUrl =
      this.endPoint + "/aboutOutOfStockReport"; // About Out of Stock report
    this.urls.profitReportUrl = this.endPoint + "/profitReport"; // Profit Report ( Only possible if cost price inserted in inventory) (Yearly, Monthly, Weekly)
    this.urls.returnedCashReportUrl = this.endPoint + "/returnedCashReport"; // Returned Cash Report
    this.urls.storeWiseReportUrl = this.endPoint + "/storeWiseReport"; // Store wise Report
    this.urls.allStoreReportUrl = this.endPoint + "/allStoreReport"; // All Store Summary (Super Admin)
    this.urls.expenseReportUrl = this.endPoint + "/expenseReport"; // Expense Report (Expenses entered by store)
    this.urls.managerWiseReportUrl = this.endPoint + "/managerWiseReport"; // Manager wise Report
    this.urls.sellUsingCardReportUrl = this.endPoint + "/sellUsingCardReport"; // Sell using Card Summary Report (Monthly, weekly, Daily, Yearly, etc.)
    this.urls.gstReportUrl = this.endPoint + "/gstReport"; // GST Report
    this.urls.specialDiscountReportUrl = this.endPoint + "/specialDiscount"; // Special Discount Report
    this.urls.categorystore = this.endPoint + "/category-store";
    this.urls.exportToExcel = this.endPoint + "/exportToExcel";
    // Subcategory Starts
    this.urls.subcategorystore = this.endPoint + "/subcategory-store";
    this.urls.imagePath = this.endPoint + "/image-path";

    // Subcategory Ends
    // API URLs for Reports Section Ends
  }

  private setDbConfig() {
    this.dbConfig.name = "myDB.db";
    this.dbConfig.location = "default";
  }

  private logFunction() {
    this.log = {
      js_yyyy_mm_dd_hh_mm_ss: function () {
        let now = new Date();
        let year = "" + now.getFullYear();
        let month = "" + (now.getMonth() + 1);
        if (month.length == 1) {
          month = "0" + month;
        }
        let day = "" + now.getDate();
        if (day.length == 1) {
          day = "0" + day;
        }
        let hour = "" + now.getHours();
        if (hour.length == 1) {
          hour = "0" + hour;
        }
        let minute = "" + now.getMinutes();
        if (minute.length == 1) {
          minute = "0" + minute;
        }
        let second = "" + now.getSeconds();
        if (second.length == 1) {
          second = "0" + second;
        }
        return (
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second
        );
      },
      generatePrimaryKey: function (store_ID, user_ID) {
        let storeID = "00000000" + store_ID + "" + user_ID;
        let storeID8Digits = storeID.substr(storeID.length - 8);
        let primaryKey = "" + storeID8Digits + "AAAA" + Date.now();
        return primaryKey;
      }
    };
  }
}
