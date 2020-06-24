import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SetUpComponent } from './set-up.component';
import { MatPaginatorModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

let routes: Routes = [
    { path: '', component: SetUpComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [
        CommonModule,
        MatPaginatorModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        SetUpComponent
    ],
    exports: [],
    entryComponents: [
    ]
})

export class SetUpModule { }