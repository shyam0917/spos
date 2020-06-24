import { UserRoleChecker } from "./../../../user-role-service";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder } from "@angular/forms";
import { HttpServices } from "../../../http-service";

declare var alertify: any;
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  pushRightClass: string = "push-right";
  userName: String = JSON.parse(localStorage.getItem("userDetails")).firstName;

  message: string = "";
  @ViewChild("closeBtn") closeBtn: ElementRef;
  role: String = "";
  constructor(
    private translate: TranslateService,
    public router: Router,
    private fb: FormBuilder,
    public httpServices: HttpServices
  ) {
    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }
  ngOnInit() {
    this.role = JSON.parse(localStorage.getItem("userDetails")).code;

    console.log(this.role);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector("body");
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector("body");
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector("body");
    dom.classList.toggle("rtl");
  }

  onLoggedout() {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("isLoggedin");
  }

  changeLang(language: string) {
    this.translate.use(language);
  }

  // form for reset password
  resetPassForm = this.fb.group({
    currentPass: [""],
    newPass: [""],
    confirmPass: [""]
  });

  // submitting reset-password form
  onSubmit() {
    if (
      this.resetPassForm.value.newPass == "" ||
      this.resetPassForm.value.newPass == null ||
      this.resetPassForm.value.newPass == undefined ||
      this.resetPassForm.value.currentPass == "" ||
      this.resetPassForm.value.currentPass == null ||
      this.resetPassForm.value.currentPass == undefined ||
      this.resetPassForm.value.confirmPass == "" ||
      this.resetPassForm.value.confirmPass == null ||
      this.resetPassForm.value.confirmPass == undefined
    ) {
      this.message = "Please fill all the fields";
      setTimeout(() => {
        this.message = "";
      }, 1000);
    } else {
      if (
        localStorage.getItem("isLoggedin") &&
        JSON.parse(localStorage.getItem("isLoggedin"))
      ) {
        if (
          this.resetPassForm.value.newPass ==
          this.resetPassForm.value.confirmPass
        ) {
          let user = JSON.parse(localStorage.getItem("userDetails"));
          let data = {
            userName: user.userName,
            passData: this.resetPassForm.value
          };
          this.httpServices.resetPassword(data).subscribe(
            result => {
              this.message = result["msg"];
              setTimeout(() => {
                this.message = "";
              }, 1000);
              alertify.success(this.message);
              this.resetPassForm.reset();
              this.closeBtn.nativeElement.click();
            },
            error => {
              this.message = error.error.msg;
            }
          );
        } else {
          this.message = "Confirm password not matched";
        }
      } else {
        this.message = "Login again";
      }
    }
  }

  // on Modal close
  onClose() {
    this.resetPassForm.reset();
  }
}
