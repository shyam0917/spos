import { debounce } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { routerTransition } from "../../router.animations";
import { HttpServices } from "../../http-service";
import { unchangedTextChangeRange } from "typescript";
import { Location } from "@angular/common";
import { UserRoleChecker } from "../../user-role-service";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap"; //03-august regan
import { Pagination } from "../../modals/pagination";
import { MatPaginator } from "@angular/material";
declare var alertify: any;
@Component({
  selector: "app-create-manager",
  templateUrl: "./create-manager.component.html",
  styleUrls: ["./create-manager.component.scss"],
  animations: [routerTransition()]
})
export class CreateManagerComponent extends Pagination implements OnInit {
  roles: any = [];
  emailPermit: boolean = false;
  emailPermitOnUpdate: boolean = false;
  userPermit: boolean = false;
  namePermitOnUpdate: boolean = false;
  createManagerFormHide: boolean = true;
  updateManagerFormHide: boolean = true;
  sub: any;
  storeId: number;
  role: string = "default";
  Firstname: string = "";
  Middlename: string = "";
  Lastname: string = "";
  Email: string = "";
  tempEmail: string = "";
  Username: string = "";
  tempUsername: string = "";
  Password: string = "";
  PhoneNumber: number;
  EmergencyContactNumber: number;
  managers: any = [];
  sysUserID: number = 0;
  users: any;

  roleFlag: boolean;
  FirstnameFlag: boolean;
  MiddlenameFlag: boolean;
  LastnameFlag: boolean;
  EmailFlag: boolean;
  UsernameFlag: boolean;
  PasswordFlag: boolean;
  PhoneNumberFlag: boolean;
  EmergencyContactNumberFlag: boolean;

  managerUpdateSuccess = false;
  managerCreateSuccess = false;
  moreDetailToggle: boolean = false;
  localIndex: any = null;
  storeIndex: any;
  pageSize: number;
  dataFlag: boolean;

  constructor(
    public httpServices: HttpServices,
    public router: Router,
    public route: ActivatedRoute,
    private location: Location,
    private userRoleChecker: UserRoleChecker,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    if (this.userRoleCheck("manager", "read") == false) {
      this.location.back();
    }

    // debugger
    this.sub = this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.storeId = +params["storeId"] || 0; // (+) converts string 'id' to a number
      this.fetchManagers(this.storeId);
    });
    this.getRoles();
    this.createManager();
  }

  validateEmail(email) {
    // var re = /\S+@\S+\.\S+/;
    // var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //03-august
    var re = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/; //01- Jan   Aman Tyagi
    return re.test(email);
  }

  getRoles() {
    this.httpServices.getRoles().then((roleData: any) => {
      let code = localStorage.getItem("userDetails")
        ? JSON.parse(localStorage.getItem("userDetails")).name
        : null;

      if (code === "Admin" || "Super Admin") {
        this.roles = roleData.data.result.slice(1);
      } else {
        this.roles = roleData.data.result.slice(2);
      }
    });
  }

  remove(arr) {
    var what,
      a = arguments,
      L = a.length,
      ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  checkEmail(val) {
    if (val == this.tempEmail) {
      this.emailPermit = false;
    } else {
      let id = {
        p_email: val,
        p_storeId: this.storeId
      };
      if (id) {
        this.httpServices.check_email(id).then((maildata: any) => {
          // debugger
          let mail = maildata;
          if (mail.data.result === "email exist") {
            this.emailPermit = true;
          } else if (mail.data.result === "email not exist") {
            this.emailPermit = false;
          }
        });
      }
    }
  }

  chkuser: any;
  checkUsername(val) {
    if (val == this.tempUsername) {
      this.userPermit = false;
    } else {
      let username = {
        p_userName: val,
        p_storeId: this.storeId
      };
      if (val) {
        this.httpServices.check_user(username).then((usersdata: any) => {
          this.chkuser = usersdata;
          if (this.chkuser.data.result === "userName exist") {
            this.userPermit = true;
          } else if (this.chkuser.data.result === "userName not exist") {
            this.userPermit = false;
          }
        });
      }
    }
  }

  phoneValidate: boolean = false;
  emergencyPhoneValidate: boolean = false;
  FirstnameValidate: boolean = false;
  MiddlenameValidate: boolean = false;
  LastnameValidate: boolean = false;

  create(info, updateFlag) {
    console.log("info", info, "=>", updateFlag);
    this.phoneValidate = false; //03-august
    this.emergencyPhoneValidate = false;
    this.FirstnameValidate = false;

    if (/^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/.test(info.phonenumber)) {
      if (
        /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/.test(
          info.emergencyContact ? info.emergencyContact : 2626262626
        )
      ) {
      } else {
        this.emergencyPhoneValidate = true;
        return;
      }
    } else {
      this.phoneValidate = true;
      if (
        /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/.test(
          info.emergencyContact ? info.emergencyContact : 1092872625
        )
      ) {
      } else {
        this.emergencyPhoneValidate = true;
        return;
      }
      return;
    }

    if (/^[a-zA-Z]*$/.test(info.firstname)) {
      if (/^[a-zA-Z]*$/.test(info.middlename ? info.middlename : "Test")) {
        if (/^[a-zA-Z]*$/.test(info.lastname ? info.lastname : "Test")) {
        } else {
          this.LastnameValidate = true;
          return;
        }
      } else {
        this.MiddlenameValidate = true;
        if (/^[a-zA-Z]*$/.test(info.lastname ? info.lastname : "Test")) {
          return;
        } else {
          this.LastnameValidate = true;
          return;
        }
      }
    } else {
      this.FirstnameValidate = true;
      if (/^[a-zA-Z]*$/.test(info.middlename ? info.middlename : "Test")) {
        if (/^[a-zA-Z]*$/.test(info.lastname ? info.lastname : "Test")) {
          return;
        } else {
          this.LastnameValidate = true;
          return;
        }
      } else {
        this.MiddlenameValidate = true;
        if (/^[a-zA-Z]*$/.test(info.lastname ? info.lastname : "Test")) {
          return;
        } else {
          this.LastnameValidate = true;
          return;
        }
      }
    }
    let param = {
      p_store_ID: this.storeId,
      p_role: info.role,
      p_firstName: info.firstname,
      p_middleName: info.middlename,
      p_lastName: info.lastname,
      p_email: info.email,
      p_userName: info.username,
      p_password: info.password,
      p_mobile: info.phonenumber,
      p_emergencyContact: info.emergencyContact,
      p_sysUser_ID: 0
    };
    if (updateFlag) {
      param.p_sysUser_ID = this.sysUserID;
      this.httpServices.register(param).then(data => {
        this.users = data;
        this.createManagerFormHide = true;
        if (this.users.code == 0) {
          if (this.users.data.code == 0) {
            this.managerUpdateSuccess = true;
            this.fetchManagers(this.storeId);
            alertify.success("User Updated Successfully");
          }
        } else {
          alertify.error("Somthing Went Wrong");
        }
      });
    } else {
      this.httpServices.register(param).then(data => {
        this.users = data;
        this.createManagerFormHide = true;
        if (this.users.code == 0) {
          if (
            this.users.data.code == 0 &&
            this.users.data.result == "registered"
          ) {
            this.managerCreateSuccess = true;
            this.fetchManagers(this.storeId);
            alertify.success("User Created Successfully");
          }
        }
      });
    }
  }

  createManager() {
    this.updateManagerFormHide = true;
    this.role = "default";
    this.Firstname = "";
    this.Middlename = "";
    this.Lastname = "";
    this.Email = "";
    this.Username = undefined;
    this.Password = undefined;
    this.PhoneNumber = undefined;
    this.EmergencyContactNumber = undefined;

    this.roleFlag = true;
    this.FirstnameFlag = true;
    this.MiddlenameFlag = true;
    this.LastnameFlag = true;
    this.EmailFlag = true;
    this.UsernameFlag = true;
    this.PasswordFlag = true;
    this.PhoneNumberFlag = true;
    this.EmergencyContactNumberFlag = true;

    this.managerUpdateSuccess = false;
    this.managerCreateSuccess = false;
  }

  fetchManagers(id) {
    let info = {
      id: id,
      ...this.validPageOptions
    };
    this.httpServices.getManagers(info).then((data: any) => {
      console.log("dataaaaaa", data);
      if (data.data.result == "null") {
        this.dataFlag = false;
        this.managers = [];
      } else {
        let tempData = data.data.result;
        this.dataFlag = true;
        tempData.forEach((element, i) => {
          // 2 Jan 2020  by Aman Tyagi
          switch (element.role) {
            case "SADM":
              tempData[i].role = "Super Admin";
              break;
            case "ADM":
              tempData[i].role = "Admin";
              break;
            case "ACM":
              tempData[i].role = "Account Manager";
              break;
            case "STRADM":
              tempData[i].role = "Store Admin";
              break;
            case "STRMAG":
              tempData[i].role = "Store Manager";
              break;
            case "STRUSR":
              tempData[i].role = "Store User";
              break;
            case "SYSUSR":
              tempData[i].role = "System User";
              break;
            default:
              tempData[i].role = "Unknown";
          }
        });
        this.managers = tempData;
        this.total = data.data.result[0].totalRecord;
      }
      console.log(this.dataFlag);
    });
  }

  editManagerFunction(data) {
    let role;
    switch (data.role) {
      case "Super Admin":
        role = "SADM";
        break;
      case "Admin":
        role = "ADM";
        break;
      case "Account Manager":
        role = "ACM";
        break;
      case "Store Admin":
        role = "STRADM";
        break;
      case "Store Manager":
        role = "STRMAG";
        break;
      case "Store User":
        role = "STRUSR";
        break;
      case "System User":
        role = "SYSUSR";
        break;
      default:
        role = "ADM";
    }
    this.updateManagerFormHide = false;
    this.route.queryParams.subscribe(params => {
      this.storeId = +params["storeId"] || 0;
    });
    this.createManagerFormHide = false;
    this.storeId = data.store_ID;
    this.role = role;
    this.Firstname = data.firstName;
    this.Middlename = data.middleName;
    this.Lastname = data.lastName;
    this.Email = data.email;
    this.tempEmail = data.email;
    this.Username = data.userName;
    this.tempUsername = data.userName;
    this.Password = data.password;
    this.PhoneNumber = data.mobile;
    this.EmergencyContactNumber = data.emergencyContact;
    this.sysUserID = data.sysUser_ID;

    this.roleFlag = data.role == "default" ? false : true;
    this.FirstnameFlag = data.firstName == undefined ? false : true;
    this.MiddlenameFlag = data.middleName == undefined ? false : true;
    this.LastnameFlag = data.lastName == undefined ? false : true;
    this.EmailFlag = data.email == undefined ? false : true;
    this.UsernameFlag = data.username == undefined ? false : true;
    this.PasswordFlag = data.password == undefined ? false : true;
    this.PhoneNumberFlag = data.mobile == undefined ? false : true;
    this.EmergencyContactNumberFlag =
      data.emergencyContact == undefined ? false : true;

    this.managerUpdateSuccess = false;
    this.managerCreateSuccess = false;
  }

  closeResult: string; //03-august regan
  usernameForDeleteModal: any;
  roleForDeleteModal: any;
  openDeleteRole(storeDelete, id, userName, role) {
    this.usernameForDeleteModal = userName;
    this.roleForDeleteModal = role;

    this.modalService.open(storeDelete).result.then(
      result => {
        this.httpServices.deleteManager(id).then((data: any) => {
          if (data.code == 0) {
            alertify.success("User Deleted");
          } else {
            alertify.success("Somthing Went Wrong");
          }
          this.fetchManagers(this.storeId);
        });
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  // deleteManagerFn(id) {

  // }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }
  onPressPhone(phoneDetail) {
    if (phoneDetail == "PhoneNumber") {
      this.phoneValidate = false;
    }
    if (phoneDetail == "EmergencyContactNumber") {
      this.emergencyPhoneValidate = false;
    }
  }
  onChangeName(name) {
    // if (name == "Firstname") {
    //   this.FirstnameValidate = false;
    // }
    switch (name) {
      case "Firstname":
        this.FirstnameValidate = false;
        break;
      case "Middlename":
        this.MiddlenameValidate = false;
        break;
      case "Lastname":
        this.LastnameValidate = false;
        break;
      default:
        this.FirstnameValidate = false;
    }
  }
  onNameChange() {
    this.userPermit = false;
  }
  managerMoreDetail(storeIndex) {
    if (this.localIndex == null) {
      this.localIndex = storeIndex;
      this.storeIndex = storeIndex;
      this.moreDetailToggle = !this.moreDetailToggle;
    } else {
      if (this.localIndex == storeIndex) {
        this.moreDetailToggle = !this.moreDetailToggle;
      } else {
        this.moreDetailToggle = true;
        this.localIndex = storeIndex;
        this.storeIndex = storeIndex;
      }
    }
  }

  /*
    Method For Changing The Pagination
  */
  changePage(event: MatPaginator) {
    if (this.pageSize == event.pageSize) {
      this.moreDetailToggle = false;
    }
    this.pageSize = event.pageSize;
    this.pageOptionsOnChange = event;
    this.fetchManagers(this.storeId);
  }
}
