import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { HttpServices } from "../http-service";

@Component({
  selector: "app-forgetpass",
  templateUrl: "./forgetpass.component.html",
  styleUrls: ["./forgetpass.component.scss"]
})
export class ForgetpassComponent implements OnInit {
  obj = {
    email: ""
  };
  sendingMailInProcess: boolean = false;

  constructor(public httpServices: HttpServices) {}

  ngOnInit() {}

  resMsg: string;
  forgetUser(obj) {
    if (obj.email == "") {
      this.resMsg = "Please Enter EmaiId";
      setTimeout(() => {
        this.resMsg = "";
      }, 900);
      return false;
    } else {
      this.sendingMailInProcess = true;
      this.httpServices.forgetUser(obj).subscribe((response: any) => {
        this.sendingMailInProcess = false;
        if (response.msg == "this email id not registered") {
          this.resMsg = "Email not registered";
          setTimeout(() => {
            this.resMsg = "";
          }, 1000);
          return false;
        } else if (response.msg == "mail has been sent") {
          this.resMsg = "Mail Sent";
          setTimeout(() => {
            this.resMsg = "";
          }, 1500);
        } else if (response.msg == "somthing went wrong") {
          this.resMsg = "somthing went wrong";
        }
      });
    }
  }
}
