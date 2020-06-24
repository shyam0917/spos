import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// relative import
import { BsComponentRoutingModule } from "./bs-component-routing.module";
import { BsComponentComponent } from "./bs-component.component";
import { PageHeaderModule } from "./../../shared";
import {
  AlertComponent,
  ButtonsComponent,
  ModalComponent,
  CollapseComponent,
  DatePickerComponent,
  DropdownComponent,
  PaginationComponent,
  PopOverComponent,
  ProgressbarComponent,
  TabsComponent,
  TooltipComponent,
  TimepickerComponent
} from "./components";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PageHeaderModule,
    BsComponentRoutingModule
  ],
  declarations: [
    BsComponentComponent,
    ButtonsComponent,
    AlertComponent,
    ModalComponent,
    CollapseComponent,
    DatePickerComponent,
    DropdownComponent,
    PaginationComponent,
    PopOverComponent,
    ProgressbarComponent,
    TabsComponent,
    TooltipComponent,
    TimepickerComponent
  ]
})
export class BsComponentModule {}
