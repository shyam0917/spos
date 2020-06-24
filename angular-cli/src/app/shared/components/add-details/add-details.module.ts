import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddDetailsRoutingModule } from './add-details-routing.module';
import { AddDetailsComponent } from './add-details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AddDetailsRoutingModule
    ],
    declarations: [AddDetailsComponent, ]
})
export class AddDetailsModule {
}
