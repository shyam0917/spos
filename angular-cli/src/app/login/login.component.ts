import { IdealTimeService } from "./../ideal-time.service";
import { debug } from "util";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { debounce } from "rxjs/operators";
import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";
// import { IdealTimeService } from "../ideal-time.service";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { routerTransition } from "../router.animations";
import { HttpServices } from "../http-service";
import { Storage } from "../modals/app.class";
import { VerifyService } from "../auth/verify-service";
import { from } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loginFailed: boolean;
  loginMessage: any;
  loginAccessDenied: boolean;
  // public myForm: FormGroup;
  // constructor(public router: Router) {
  // }
  constructor(
    public router: Router,
    public httpServices: HttpServices,
    public storage: Storage,
    public verifyService: VerifyService,
    public IdealTimeService: IdealTimeService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    if (localStorage.getItem("access_token") != null) {
      this.verifyService.verify().then((data: any) => {
        if (data.verifytoken == true) {
          this.router.navigate(["/dashboard"]);
        }
      });
    }
  }

  loginUser(e) {
    this.loginAccessDenied = false;
    e.preventDefault();
    const log = {
      p_username: e.target.elements[0].value,
      p_password: e.target.elements[1].value
    };
    this.httpServices.login(btoa(JSON.stringify(log))).then((response: any) => {
      if (
        response.data.code === 0 &&
        response.data.result === "login successful"
      ) {
        this.storage.setItem("isLoggedin", "true");
        this.loginFailed = false;
        this.loginAccessDenied = false;
        this.loginMessage = "";
        localStorage.setItem("userDetails", JSON.stringify(response.data.user));
        localStorage.setItem("access_token", response.data.token);
        this.ngZone.run(() => {
          this.IdealTimeService.setUserLoggedIn(true);
          this.router.navigate(["./dashboard"]);
        });
      } else {
        if (response.data.code === 1) {
          this.loginFailed = true;
          this.loginMessage = "Invalid login";
        } else if (response.data.code === 3) {
          this.loginAccessDenied = true;
          this.loginMessage = "Access Denied";
        } else {
          this.loginAccessDenied = true;
          this.loginMessage = "Access Denied";
        }
      }
      setTimeout(() => {
        this.loginMessage = "";
      }, 700);
    });
  }
}
