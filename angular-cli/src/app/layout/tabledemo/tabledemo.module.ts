import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabledemoComponent } from './tabledemo.component';
import { TabledemoRoutingModule } from './tabledemo-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TabledemoRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [TabledemoComponent]
})
export class TabledemoModule { }
