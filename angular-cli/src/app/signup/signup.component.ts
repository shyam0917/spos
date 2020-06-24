import { debug } from "util";
import { debounce } from "rxjs/operators";
import { DEFAULT_CONFIG } from "tslint/lib/configuration";
import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../router.animations";
import { HttpServices } from "../http-service";
import { FormGroup, FormControl } from "@angular/forms";
// import { timingSafeEqual } from "crypto";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { ConditionalExpr } from "@angular/compiler";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
  profileForm: FormGroup;
  public emailPermit: boolean;
  public userNamePermit: boolean;
  public emailStatus: boolean;
  storeId: any;
  allStoreIds: any;
  message: boolean = false;
  userNameStatus: String = "";
  constructor(public httpServices: HttpServices, private fb: FormBuilder) {}
  checkEmail(val) {
    let id = {
      p_email: val,
      p_storeId: this.storeId
    };

    if (id) {
      if (this.profileForm.controls["p_email"].errors) {
        this.emailStatus = true;
      } else {
        this.httpServices.check_email(id).then(maildata => {
          let mail = maildata;
          if (mail["data"]["result"] === "email exist") {
            this.emailPermit = true;
          } else if (mail["data"]["result"] === "email not exist") {
            this.emailPermit = false;
          }
        });
      }
    }
  }
  setStoreId(storeId) {
    this.storeId = storeId;
  }

  ngOnInit() {
    this.getAllStoreId();
    this.profileForm = this.fb.group({
      p_store_ID: ["", Validators.required],
      p_role: ["SADM", Validators.required],
      p_firstName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z]+$")
          // Validators.pattern("^[a-zA-Z_-]+$")
        ])
      ],
      p_middleName: ["", Validators.pattern("^[a-zA-Z]+$")],
      p_lastName: ["", Validators.pattern("^[a-zA-Z]+$")],
      p_email: [
        "",
        Validators.compose([
          Validators.required,
          // Validators.email,
          // Validators.pattern("^[a-z]+[a-z0-9._]+@[a-z]+.[a-z.]{2,5}$")
          Validators.pattern(
            "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{1,5})$"
          )
        ])
      ],
      p_userName: ["", Validators.required],
      p_password: ["", Validators.required],
      p_mobile: [
        "",
        Validators.compose([
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999)
        ])
      ],
      p_emergencyContact: [
        "",
        Validators.compose([
          Validators.required,
          Validators.min(1000000000),
          Validators.max(9999999999)
        ])
      ]
    });
  }
  onSubmit() {
    var data = this.profileForm.value;
    // console.log("data22", data);
    data.p_sysUser_ID = 0;
    this.httpServices.register(data).then(output => {
      if ((output["data"]["result"] = "registered")) {
        this.message = true;
        // this.profileForm.setValue = {};
        this.profileForm.reset();
        setTimeout(() => {
          this.message = false;
        }, 2000);
      } else if ((output["data"]["result"] = "not registered")) {
        this.message = false;
      } else {
        this.message = false;
      }
    });
  }
  checkUserName(userName) {
    let id = {
      p_userName: userName,
      p_storeId: this.storeId
    };

    if (id) {
      // console.log("Method run for heck username");
      this.httpServices.check_user(id).then(maildata => {
        let mail = maildata;
        // console.log("Username result from Db", mail["status"]);

        if (mail["status"] === "Success") {
          this.userNamePermit = true;
        } else if (mail["status"] === "invalid data") {
          this.userNamePermit = false;
        } else {
          this.userNamePermit = false;
        }
      });
    }
  }
  getAllStoreId() {
    this.httpServices.getAllStoreId().subscribe(allStoreID => {
      // console.log("In signup Component", allStoreID.data.result);
      this.allStoreIds = allStoreID["data"]["result"];
    });
  }
}
