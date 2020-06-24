import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { Storage } from "./modals/app.class";
import { fail } from "assert";

@Injectable()
export class UserRoleChecker {
  object: any = JSON.parse(localStorage.getItem("userDetails"));

  constructor(public storage: Storage) {}

  userRoleChekerFunction(param, btn_type) {
    let flag;
    this.object = JSON.parse(localStorage.getItem("userDetails"));
    if (this.object == null || this.object == undefined) {
      return;
    }
    switch (btn_type) {
      case "create":
        flag = this.object[param].indexOf("C") > -1 ? true : false;
        break;
      case "read":
        flag = this.object[param].indexOf("R") > -1 ? true : false;
        break;
      case "update":
        flag = this.object[param].indexOf("U") > -1 ? true : false;
        break;
      case "delete":
        flag = this.object[param].indexOf("D") > -1 ? true : false;
        break;
      default:
        flag = false;
    }
    return flag;
  }
}
