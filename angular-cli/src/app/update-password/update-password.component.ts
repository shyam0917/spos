import { Component, OnInit, OnChanges } from "@angular/core";
import { NgForm } from "@angular/forms";
import { HttpServices } from "../http-service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

@Component({
  selector: "app-update-password",
  templateUrl: "./update-password.component.html",
  styleUrls: ["./update-password.component.scss"]
})
export class UpdatePasswordComponent implements OnInit {
  urlsysid;
  viewShow: boolean = false;
  obj = {
    newPassword: "",
    confirmPassword: ""
  };

  constructor(
    public httpServices: HttpServices,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParamMap.subscribe(params => {
      if (params.get("sysid")) {
        this.viewShow = true;
      } else {
        this.viewShow = false;
        this.router.navigate(["/login"]);
      }
    });
    this.urlsysid = this.route.snapshot.queryParamMap.get("sysid");

  }

  ngOnInit() { }

  resMsg: string;
  updatePassword(obj) {

    console.log(obj)
    if (obj.newPassword == "" || obj.confirmPassword == "") {
      setTimeout(() => {
        this.resMsg = "All filled are required";
        return false;
      }, 100)
    }
    if (obj.newPassword != obj.confirmPassword) {
      this.resMsg = "Password not matched";
      return false;
    }
    var formdata = {
      newPassword: obj.newPassword,
      urlsyid: atob(this.urlsysid)
    };
    this.httpServices.updatePassword(formdata).subscribe((response: any) => {
      if (response.msg == "password change successfully") {
        this.resMsg = "Password change successfully";
        this.router.navigate(["/login"]);
      } else if (
        response.msg ==
        "Linc status is not active, may be mail havent send to the user"
      ) {
        this.resMsg = "Linc status is not active";
      } else if (
        response.msg == "Session time expired, please resend linc on your mail"
      ) {
        this.resMsg = "Session time expired";
      } else {
        this.resMsg = "some problem";
        return false;
      }
    });
  }
}
