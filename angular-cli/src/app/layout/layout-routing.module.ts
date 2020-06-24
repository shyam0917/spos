import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "./layout.component";

var a = true;

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "hsnCode", loadChildren: "./set-up/set-up.module#SetUpModule" },
      // Admin Tool Routing Begin
      {
        path: "dashboard",
        loadChildren: "./dashboard/dashboard.module#DashboardModule"
      },
      {
        path: "createStore",
        loadChildren: "../store/store.module#StoreModule"
      },
      {
        path: "add-details/:id",
        loadChildren:
          "../shared/components/add-details/add-details.module#AddDetailsModule"
      },
      {
        path: "createManager",
        loadChildren:
          "./create-manager/create-manager.module#CreateManagerModule"
      },
      {
        path: "tableDemo",
        loadChildren: "./tabledemo/tabledemo.module#TabledemoModule"
      },
      { path: "sales", loadChildren: "./sales/sales.module#SalesModule" },
      {
        path: "purchase",
        loadChildren: "./purchase/purchase.module#PurchaseModule"
      },
      {
        path: "inventory",
        loadChildren: "./inventory/inventory.module#InventoryModule"
      },
      {
        path: "outOfStock",
        loadChildren: "./outofstock/outofstock.module#OutofstockModule"
      },
      {
        path: "transactionReport",
        loadChildren:
          "../reports/transaction-report/transaction-report.module#TransactionReportModule"
      },
      {
        path: "expiredGoodsReport",
        loadChildren:
          "../reports/expired-goods-report/expired-goods-report.module#ExpiredGoodsReportModule"
      },
      {
        path: "cashReport",
        loadChildren:
          "../reports/cash-report/cash-report.module#CashReportModule"
      },
      {
        path: "salesReport",
        loadChildren:
          "../reports/sales-report/sales-report.module#SalesReportModule"
      },
      {
        path: "customerReport",
        loadChildren:
          "../reports/customer-report/customer-report.module#CustomerReportModule"
      },
      {
        path: "userBilledReport",
        loadChildren:
          "../reports/user-billed-report/user-billed-report.module#UserBilledReportModule"
      },
      {
        path: "billTaxReport",
        loadChildren:
          "../reports/bill-tax-report/bill-tax-report.module#BillTaxReportModule"
      },
      {
        path: "voidBillReport",
        loadChildren:
          "../reports/void-bill-report/void-bill-report.module#VoidBillReportModule"
      },
      {
        path: "returnedItemReport",
        loadChildren:
          "../reports/returned-item-report/returned-item-report.module#ReturnedItemReportModule"
      },
      {
        path: "inventoryReport",
        loadChildren:
          "../reports/inventory-report/inventory-report.module#InventoryReportModule"
      },
      {
        path: "outOfStockReport",
        loadChildren:
          "../reports/out-of-stock-report/out-of-stock-report.module#OutOfStockReportModule"
      },
      {
        path: "aboutOutOfStockReport",
        loadChildren:
          "../reports/about-out-of-stock-report/about-out-of-stock-report.module#AboutOutOfStockReportModule"
      },
      {
        path: "profitReport",
        loadChildren:
          "../reports/profit-report/profit-report.module#ProfitReportModule"
      },
      {
        path: "returnedCashReport",
        loadChildren:
          "../reports/returned-cash-report/returned-cash-report.module#ReturnedCashReportModule"
      },
      {
        path: "storeWiseReport",
        loadChildren:
          "../reports/store-wise-report/store-wise-report.module#StoreWiseReportModule"
      },
      {
        path: "allStoreReport",
        loadChildren:
          "../reports/all-store-report/all-store-report.module#AllStoreReportModule"
      },
      {
        path: "expenseReport",
        loadChildren:
          "../reports/expense-report/expense-report.module#ExpenseReportModule"
      },
      {
        path: "managerWiseReport",
        loadChildren:
          "../reports/manager-wise-report/manager-wise-report.module#ManagerWiseReportModule"
      },
      {
        path: "sellUsingCardReport",
        loadChildren:
          "../reports/sell-using-card-report/sell-using-card-report.module#SellUsingCardReportModule"
      },
      {
        path: "gstReport",
        loadChildren: "../reports/gst-report/gst-report.module#GstReportModule"
      },
      {
        path: "specialDiscountReport",
        loadChildren:
          "../reports/special-discount-report/special-discount-report.module#SpecialDiscountReportModule"
      },
      // Admin Tool Routing Ends

      // Predefined Routing Begin
      { path: "charts", loadChildren: "./charts/charts.module#ChartsModule" },
      { path: "tables", loadChildren: "./tables/tables.module#TablesModule" },
      { path: "forms", loadChildren: "./form/form.module#FormModule" },
      {
        path: "bs-element",
        loadChildren: "./bs-element/bs-element.module#BsElementModule"
      },
      { path: "grid", loadChildren: "./grid/grid.module#GridModule" },
      {
        path: "components",
        loadChildren: "./bs-component/bs-component.module#BsComponentModule"
      },
      {
        path: "blank-page",
        loadChildren: "./blank-page/blank-page.module#BlankPageModule"
      }
      // Predefined Routing Ends
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
