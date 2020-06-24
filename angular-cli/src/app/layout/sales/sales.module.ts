import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { SalesRoutingModule } from './sales-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FancyImageUploaderModule } from 'ng2-fancy-image-uploader';

@NgModule({
  imports: [
    CommonModule,
    SalesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // FancyImageUploaderModule
  ],
  declarations: [SalesComponent]
})
export class SalesModule { }
