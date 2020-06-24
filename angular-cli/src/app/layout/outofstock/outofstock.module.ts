import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutofstockComponent } from './outofstock.component';
import { OutofstockRoutingModule } from './outofstock-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    OutofstockRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [OutofstockComponent]
})
export class OutofstockModule { }
