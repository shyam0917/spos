import { GlobalServiceService } from "./../../../auth/global-service.service";
import { Component, OnInit } from "@angular/core";
import { UserRoleChecker } from "../../../user-role-service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  isActive = false;
  showMenu = "";
  isAdmin = false;

  loginInfo: any;
  userName: String = JSON.parse(localStorage.getItem("userDetails")).firstName;

  constructor(
    public userRoleChecker: UserRoleChecker,
    private globalService: GlobalServiceService
  ) {}

  ngOnInit() {
    let data = localStorage.getItem("userDetails");
    if ((data && JSON.parse(data).code == "ADM") || "SADM" || "STRADM") {
      this.isAdmin = true;
    }
    this.loginInfo = JSON.parse(localStorage.getItem("userDetails"));
  }

  createStore() {
    this.globalService.getStore(true);
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  onLoggedout() {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("isLoggedin");
  }
}
