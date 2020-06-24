import { ResetPasswordComponent } from './reset-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    { path: '', component: ResetPasswordComponent, pathMatch: 'full' }
]

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [
        RouterModule
    ]
})

export class ResetPasswordModule {}