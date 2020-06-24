import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { HttpServices } from "../http-service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent implements OnInit {
  message: string = "";
  constructor(private fb: FormBuilder, public httpServices: HttpServices) {}

  ngOnInit() {}
  resetPassForm = this.fb.group({
    currentPass: [""],
    newPass: [""],
    confirmPass: [""]
  });
  onSubmit() {
    // let isLoged  = JSON.parse(localStorage.getItem("isLoggedin"))
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
}
