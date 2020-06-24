import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./shared";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./layout/layout.module#LayoutModule",
    canActivate: [AuthGuard]
  },

  {
    path: "forgetpass",
    loadChildren: "./forgetpass/forgetpass.module#ForgetpassModule"
  },
  // { path: 'hsnCode', loadChildren: () => import('.').then(m => m.ForgetpassModule) },
  {
    path: "updatePass",
    loadChildren: "./update-password/update-pass.module#UpdatePassModule"
  },
  { path: "login", loadChildren: "./login/login.module#LoginModule" },
  { path: "signup", loadChildren: "./signup/signup.module#SignupModule" },
  {
    path: "not-found",
    loadChildren: "./not-found/not-found.module#NotFoundModule"
  },
  {
    path: "reset-password",
    loadChildren: "./reset-password/reset-password.module#ResetPasswordModule"
  },
  { path: "**", redirectTo: "not-found" }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  // exports: [RouterModule]

  imports: [RouterModule.forRoot(routes, { useHash: true })], //added aug-21 regan
  exports: [RouterModule]
})
export class AppRoutingModule {}
