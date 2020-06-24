import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreRoutingModule } from "./store-routing.module";
import { StoreComponent } from "../store/store.component";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatPaginatorModule } from "@angular/material";

import { UiSwitchModule } from "ngx-ui-switch"; // august-10
@NgModule({
  imports: [
    CommonModule,
    StoreRoutingModule,
    FormsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    UiSwitchModule.forRoot({
      size: "small",
      color: "rgb(23, 126, 237)"
    })
  ],
  declarations: [StoreComponent]
})
export class StoreModule {}
