import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent, SidebarComponent } from '../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// import { FancyImageUploaderModule } from 'ng2-fancy-image-uploader';

// import { OutofstockComponent } from './outofstock/outofstock.component';
// import { InventoryComponent } from './inventory/inventory.component';
// import { PurchaseComponent } from './purchase/purchase.component';
// import { SalesComponent } from './sales/sales.component';
// import { TabledemoComponent } from './tabledemo/tabledemo.component';
// import { CreateManagerComponent } from './create-manager/create-manager.component';

@NgModule({
    imports: [
        CommonModule,
        NgbDropdownModule,
        LayoutRoutingModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
    ],
    declarations: [
        LayoutComponent,
        HeaderComponent,
        SidebarComponent
        // OutofstockComponent
        // InventoryComponent,
        // PurchaseComponent
        // SalesComponent,
        // TabledemoComponent,
        // CreateManagerComponent,
    ]
})
export class LayoutModule { }
