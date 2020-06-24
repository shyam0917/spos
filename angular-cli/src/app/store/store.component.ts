import { transition } from "@angular/animations";
import { GlobalServiceService } from "./../auth/global-service.service";
import { debug } from "util";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { routerTransition } from "../router.animations";
import { HttpServices } from "../http-service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
// import { SimpleNotificationsModule } from 'angular2-notifications';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UserRoleChecker } from "../user-role-service";
import { Location } from "@angular/common";
import { Pagination } from "../modals/pagination";
import { MatPaginator } from "@angular/material";
declare var alertify: any;
import * as moment from "moment";

@Component({
  selector: "app-store",
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [routerTransition()]
})
export class StoreComponent extends Pagination implements OnInit {
  editButtonEnable: boolean = false;
  createStoreFormHide: boolean = true;
  seconds = true;
  storeMessage: string = "";
  chkStoreName: boolean = false;
  checkStoreResultMsg: any;
  storeData: any = [];
  Store_ID: number = 0;
  checkNegative = false;
  btndisabled = true;
  StoreName: string = "";
  StoreAddress: string = "";
  category_ID: number;
  subcategory_ID: number;
  msgOnAddSubCat: string = "";
  City: string = "";
  State: string = "";
  Pin: string = "000000";
  OpenTime: string = "";
  CloseTime: string = "";
  ManagerName: string = "";
  EmployeesCount: string = "0";
  ContactNumber: string = "";

  StoreNameFlag: boolean;
  StoreAddressFlag: boolean;
  CityFlag: boolean;
  StateFlag: boolean;
  PinFlag: boolean;
  OpenTimeFlag: boolean;
  CloseTimeFlag: boolean;
  ManagerNameFlag: boolean;
  EmployeesCountFlag: boolean;
  ContactNumberFlag: boolean;
  category_IDFlag: boolean;
  subcategory_IDFlag: boolean;

  Description: string;
  categoryData: any = [];
  subcategoryData: any = [];

  closeResult: string;
  CategoryName: string = "";
  CategoryDescription: string = "";
  SubcategoryName: string = "";
  SubcategoryDescription: string = "";

  phoneValidate: boolean = false; //03-august
  // env: any;
  addPosFlag: boolean = false;
  addPosFlagFail: boolean = false;
  editPosFlag: boolean = false;
  editPosFlagFail: boolean = false;
  store_id: number;
  pos_id: string;
  deviceStatus: number;
  pos_list: any = [];
  addPosForm: boolean = true;
  data: any;
  timeFormat;
  isDataAvailable: boolean;
  pinmessage: boolean = false;
  moreDetailToggle: boolean = false;
  pageSize: number;
  storeIndex: any;
  localIndex: any = null;
  stateObj: any = {};
  stateArray: any = [];
  cityObj: any = {};
  cityArray: any = [];
  pinStatus: Boolean = false;
  values = "";
  size = 0;
  dataFlag: number = 0;

  constructor(
    public httpServices: HttpServices,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private userRoleChecker: UserRoleChecker,
    private location: Location,
    private modalService: NgbModal,
    private globalService: GlobalServiceService
  ) {
    super();
    this.category_ID = 0;
    this.timeFormat = {
      startTime: "am",
      endTime: "am"
    };
    this.isDataAvailable = true;
  }

  ngOnInit() {
    if (this.userRoleCheck("store", "read") == false) {
      this.location.back();
    }
    if (this.userRoleCheck("store", "create") == false) {
      this.createStoreFormHide = true;
    } else {
      this.createStoreFormHide = this.activatedRoute.snapshot.queryParams[
        "store"
      ];
    }
    this.fetchCategory();
    this.fetchStore();
    this.fetchStates();
    this.globalService.createStore.subscribe(store => {
      this.createStoreFormHide = store;
    });
    this.storeMessage = "";
  }

  enterPressed(e) {
    this.size = 0;
    this.category_IDFlag = false;
    e.target.blur();
  }

  onFocus() {
    this.size = 7;
  }

  fetchStates() {
    this.httpServices.getStateData().subscribe(
      res => {
        if (res["result"] != "null") {
          this.stateObj = res["result"];
          let custArr = Object.entries(this.stateObj);
          this.stateArray = custArr.map(function (row) {
            return {
              key: row[0],
              state: row[1]
            };
          });
        }
      },
      err => { }
    );
  }

  onStateChanged(stateData) {
    this.City = "";
    const key = Object.keys(this.stateObj).find(
      key => this.stateObj[key] == stateData
    );
    this.httpServices.getCitiesData(key).subscribe(
      res => {
        if (res["result"] != "null") {
          this.cityObj = res["result"];
          let custArr = Object.entries(this.cityObj);
          this.cityArray = custArr.map(function (row) {
            return {
              key: row[0],
              city: row[1]
            };
          });
          if (!this.cityArray.length) {
            this.cityArray.push({ key: "0", city: stateData });
          }
        }
      },
      err => { }
    );
  }

  validatePhone(ev) {
    // this.env = ev.target.value;
    // this.phoneValidate = false;
    // if(this.env.length < 1) {
    //   this.phoneValidate = false;
    // } else {
    //   if(/^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/.test(this.env)) {
    //   } else {
    //     this.phoneValidate = true;
    //   }
    // }
  }

  onCreateStore(storeInfo, updateflag, ev) {
    let startTime =
      storeInfo.openTime &&
      this.changeTimeFormat(storeInfo.openTime, this.timeFormat.startTime);
    let endTime =
      storeInfo.closeTime &&
      this.changeTimeFormat(storeInfo.closeTime, this.timeFormat.endTime);

    this.phoneValidate = false;
    if (/^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/.test(storeInfo.contactNumber)) {
    } else {
      this.phoneValidate = true;
      return;
    }
    // this.validatePhone(ev);

    let store = {
      p_store_ID: this.Store_ID,
      p_storeName: storeInfo.storeName,
      p_storeAddress: storeInfo.storeAddress,
      p_category_ID: JSON.parse(storeInfo.category_ID), //edited by regan 30-july
      // p_subcategory_ID: storeInfo.subcategory_ID,
      p_city: storeInfo.city == "" ? null : storeInfo.city,
      p_state: storeInfo.state == "" ? null : storeInfo.state,
      p_pin: storeInfo.pin,
      p_openTime: startTime,
      p_closeTime: endTime,
      p_managerName: storeInfo.managerName,
      p_employeesCount: storeInfo.employeesCount,
      p_contactNumber: storeInfo.contactNumber,
      // p_contactNumber: this.env,
      p_sys_UserID: 0
    };

    if (updateflag == false) {
      delete store.p_store_ID;
      this.httpServices.create_store(store).then((response: any) => {
        if (response.data.result != "null") {
          this.storeMessage = "Store created successfully";
          this.fetchStore();
          setTimeout(() => {
            this.storeMessage = "";
            this.createStoreFormHide = true;
          }, 700);
        }
      });
    } else {
      this.httpServices.update_store(store).then((response: any) => {
        // this.createStoreFormHide = true;
        if (response.data.result != "null") {
          this.storeMessage = "Store updated successfully";
          setTimeout(() => {
            this.storeMessage = "";
            this.createStoreFormHide = true;
            this.globalService.getStore(true);
            this.fetchStore();
          }, 1000);
        }

        // this.fetchStore();
      });
    }
    this.phoneValidate = false;
  }

  changeTimeFormat(time, flag, edit = null, type = null) {
    if (!time) {
      return null;
    }
    if (!edit) {
      let saveTime = moment(`${time}${flag}`, ["h:mm A"]).format("HH:mm");
      return saveTime;
    } else {
      let storeTime = moment(time).format("HH:mm");
      let timeData = moment(storeTime, ["HH:mm"]).format("hh:mm a");
      if (timeData) {
        let timeArr = timeData.split(" ");
        type
          ? (this.timeFormat.startTime = timeArr[1])
          : (this.timeFormat.endTime = timeArr[1]);
        return timeArr[0];
      }
    }
  }

  editStoreFunction(data) {
    this.fetchSubcategory(data.category_ID); //added august-17 regan
    this.Store_ID = data.store_ID;
    this.StoreName = data.storeName;
    this.StoreAddress = data.storeAddress;
    this.category_ID = data.category_ID;
    this.subcategory_ID = data.subcategory_ID;
    this.City = data.city == null ? "" : data.city;
    this.State = data.state == null ? "" : data.state;
    this.Pin = data.pin;
    this.OpenTime =
      data.openTime && this.changeTimeFormat(data.openTime, null, true, true);
    this.CloseTime =
      data.closeTime && this.changeTimeFormat(data.closeTime, null, true);
    this.ManagerName = data.managerName;
    this.EmployeesCount = data.employeesCount;
    this.ContactNumber = data.contactNumber;
    this.createStoreFormHide = false;
    this.editButtonEnable = true;

    this.StoreNameFlag = data.storeName == undefined ? false : true;
    this.StoreAddressFlag = data.storeAddress == undefined ? false : true;
    this.CityFlag = data.city == undefined ? false : true;
    this.StateFlag = data.state == undefined ? false : true;
    this.PinFlag = data.pin == undefined ? false : true;
    this.OpenTimeFlag =
      data.openTime && data.openTime.substring(11, 16) == undefined
        ? false
        : true;
    this.CloseTimeFlag =
      data.closeTime && data.closeTime.substring(11, 16) == undefined
        ? false
        : true;
    this.ManagerNameFlag = data.managerName == undefined ? false : true;
    this.EmployeesCountFlag = data.employeesCount == undefined ? false : true;
    this.ContactNumberFlag = data.contactNumber == undefined ? false : true;
    this.category_IDFlag = data.category_ID == undefined ? false : true;
    // this.subcategory_IDFlag = data.subcategory_ID == undefined ? false : true;
  }

  createStoreFormFunction() {
    this.StoreName = "";
    this.StoreAddress = "";
    // this.category_ID;
    this.subcategory_ID = undefined;
    this.City = "";
    this.State = "";
    this.Pin = "";
    this.OpenTime = undefined;
    this.CloseTime = undefined;
    this.ManagerName = "";
    this.EmployeesCount = "";
    this.ContactNumber = "";
    this.createStoreFormHide = false;
    this.editButtonEnable = false;

    this.category_IDFlag = true;
    this.subcategory_IDFlag = true;
    this.StoreNameFlag = true;
    this.StoreAddressFlag = true;
    this.CityFlag = true;
    this.StateFlag = true;
    this.PinFlag = true;
    this.OpenTimeFlag = true;
    this.CloseTimeFlag = true;
    this.ManagerNameFlag = true;
    this.EmployeesCountFlag = true;
    this.ContactNumberFlag = true;
  }

  fetchStore() {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let userID = userDetails.sysUser_ID;
    if (userID == undefined) {
      return;
    }
    let obj = { userID: userID, ...this.validPageOptions };
    this.httpServices.fetch_store(obj).then((data: any) => {
      if (data.data.result != "null") {
        this.storeData = data.data.result;
        this.dataFlag = 1;
        this.total = data.data.result[0].totalRecord - 1;
      } else {
        this.dataFlag = 2;
      }
    });
  }

  stroreNameForDeleteModal: any;
  openDeleteStore(storeDelete, id, name) {
    this.stroreNameForDeleteModal = name;

    this.modalService.open(storeDelete).result.then(
      result => {
        this.httpServices.delete_store(id).then(() => {
          this.fetchStore();
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

  managerFunction(id) {
    this.router.navigate(["createManager"], { queryParams: { storeId: id } });
  }

  fetchCategory() {
    this.httpServices.fetch_categoryStore().then((data: any) => {
      this.categoryData = data.data.result;
    });
  }

  fetchCategoryName(id) {
    if (this.categoryData.length > 0) {
      for (let i = 0; i < this.categoryData.length; i++) {
        if (id == this.categoryData[i].category_ID) {
          return this.categoryData[i].categoryName;
        }
      }
    }
  }

  categoryID: any;
  onModelChanged(value) {
    this.categoryID = value;
    this.fetchSubcategory(this.categoryID);
  }

  fetchSubcategory(categoryID) {
    this.httpServices.fetch_subcategoryStore(categoryID).then((data: any) => {
      // this.subcategoryData = data.data.result;
      this.subcategoryData = [];
      let nsubcategoryData = data.data.result;
      for (let i = 0; i < nsubcategoryData.length; i++) {
        if (nsubcategoryData[i].category_ID == this.category_ID) {
          this.subcategoryData.push(nsubcategoryData[i]);
        }
      }
      if (this.subcategoryData.length > 0) {
        // added august-17 regan
        this.subcategory_ID = this.subcategoryData[0].subcategory_ID;
      }
    });
  }

  // fetchSubcategoryName(id){
  //   if(this.subcategoryData.length>0){
  //     for(let i=0;i<this.subcategoryData.length;i++){
  //       if(id == this.subcategoryData[i].subcategory_ID){
  //         return this.subcategoryData[i].subcategoryName;
  //       }
  //     }
  //   }
  // }

  openSm(content) {
    this.modalService.open(content);
  }
  clicktosubmit(event) {
    let modalData = {
      p_categoryName: this.CategoryName,
      p_categoryDescription: this.CategoryDescription
    };

    this.httpServices.create_category(modalData).then((response: any) => {
      this.createStoreFormHide = false;
      this.fetchCategory();
    });
    this.CategoryName = "";
    this.CategoryDescription = "";
  }

  openSm2(content2) {
    this.modalService.open(content2);
  }

  clicktosubmit2(event) {
    let modalData = {
      p_category_ID: this.category_ID,
      p_subcategoryName: this.SubcategoryName,
      p_Description: this.SubcategoryDescription
    };

    this.httpServices.create_subcategory(modalData).then((response: any) => {
      if (response.code == 3) {
        this.msgOnAddSubCat = response.data.result;
        setTimeout(() => {
          this.msgOnAddSubCat = "";
        }, 1000);
      }
      this.createStoreFormHide = false;
      this.fetchSubcategory(this.category_ID);
    });
    this.SubcategoryName = "";
    this.SubcategoryDescription = "";
  }

  openDevicesPOSModal(openDevicePOS) {
    this.fetchPOS();
    if (this.roleSpecifier == "SADM") {
      this.modalService.open(openDevicePOS, { size: "lg" }).result.then(
        result => {
          (this.store_id = undefined), //added regan 10-august
            (this.pos_id = undefined),
            (this.deviceStatus = undefined);
        },
        reason => {
          (this.store_id = undefined), //added regan august-10
            (this.pos_id = undefined),
            (this.deviceStatus = undefined);
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    } else {
      this.modalService.open(openDevicePOS).result.then(
        result => { },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }
  }

  changeDeviceStatus: boolean;
  onChange(env, storeId, posId, tableStorePosId) {
    this.changeDeviceStatus = env;

    let deviceStatus = {
      p_device_Status: this.changeDeviceStatus,
      p_Store_ID: storeId,
      p_pos_ID: posId,
      p_tableStore_pos_ID: tableStorePosId
    };

    this.httpServices
      .addDeviceStatus(deviceStatus)
      .then((response: any) => {
        if (response.code == 0) {
          if (this.changeDeviceStatus == true) {
            alertify.success("Device Status Activated");
          } else {
            alertify.success("Device Status Deactivated");
          }
        } else {
          alertify.error("Device Status was not added!");
        }
      })
      .catch(err => { });
  }

  addPOS(POS) {
    let pos = {
      p_store_ID: POS.store_id,
      p_pos_ID: POS.pos_id
      // p_deviceStatus: POS.deviceStatus
    };

    this.addPosFlag = false;
    this.addPosFlagFail = false;
    // alert(JSON.stringify(user));
    this.httpServices
      .addPOS(pos)
      .then((response: any) => {
        if (response.code == 0) {
          this.store_id = undefined;
          this.pos_id = undefined;
          this.deviceStatus = undefined;
          this.addPosFlag = false; //edited 09-august regan
          alertify.success("POS device added successfully");
          this.fetchPOS();
        } else {
          this.addPosFlagFail = true;
        }
      })
      .catch(err => {
        this.addPosFlagFail = true;
      });
  }

  roleSpecifier: any;
  fetchPOS() {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let userID = userDetails.sysUser_ID;
    this.roleSpecifier = userDetails.code;

    if (userID == undefined) {
      return;
    }
    let obj = { userID: userID };
    this.httpServices.fetchPOS(obj).then((response: any) => {
      if (response.data.result != "null") {
        this.isDataAvailable = true;
        this.pos_list = response.data.result;
        this.pos_list.filter(obj => {
          if (obj.isDeleted == 1 && obj.deviceStatus == 1) {
            obj.deviceStatus = !obj.deviceStatus;
          }
        });
      } else {
        this.isDataAvailable = false;
      }
    });
  }

  editPOSForm(pos) {
    this.addPosForm = false;
    this.data = pos;
  }

  editPOS(POS) {
    let pos = {
      p_store_ID: POS.Store_ID,
      p_pos_ID: POS.pos_ID,
      p_tbl_store_pos_ID: this.data.tbl_store_pos_ID,
      p_device_Status: POS.deviceStatus
    };
    this.addPosFlag = false;
    this.addPosFlagFail = false;
    // alert(JSON.stringify(user));
    this.httpServices
      .editPOS(pos)
      .then((response: any) => {
        if (response.code == 0) {
          this.editPosFlag = true;
          this.data = {};
          this.addPosForm = true;
          this.editPosFlag = false;
          alertify.success("POS device edited successfully!");
          this.fetchPOS();
        } else {
          this.editPosFlagFail = true;
        }
      })
      .catch(err => {
        this.editPosFlagFail = true;
      });
  }

  deletePOS(pos) {
    let delPos = {
      p_tbl_store_pos_ID: pos.tbl_store_pos_ID
    };

    this.httpServices.deletePOS(delPos).then(response => {
      alertify.success("POS device deleted successfully!");
      this.fetchPOS();
    });
  }

  strorePOS_IDForstorePosDeleteModal: any;
  storeNameForstorePosDeleteModal: any;
  deviceStatusForstorePosDeleteModal: any;
  openDeletePosID(storePosDelete, POS) {
    this.strorePOS_IDForstorePosDeleteModal = POS.pos_ID;
    this.storeNameForstorePosDeleteModal = POS.storeName;
    this.deviceStatusForstorePosDeleteModal = POS.deviceStatus;
    this.modalService.open(storePosDelete).result.then(
      result => {
        this.deletePOS(POS);
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  negativeCheck() {
    if (parseInt(this.EmployeesCount) < 0) {
      this.checkNegative = true;
      return false;
    } else {
      this.checkNegative = false;
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
    if (this.total == 0) {
    }
    this.fetchStore();
  }
  onInputPin(event) {
    let pin = event.target.value;
    console.log("RUn on input pin", pin.length);
    this.PinFlag = false;
    this.pinStatus = false;
    if (pin.length == 6) {
      console.log("working fine");
      this.pinmessage = false;
      this.httpServices.getPinInfo(pin).subscribe(data => {
        if (data[0].Status == "Error") {
          this.pinStatus = true;
          this.State = "";
          this.City = "";
          alertify.error("Invalid Pincode");
        } else {
          console.log(
            "response data : ",
            data[0].PostOffice[0].District,
            data[0].PostOffice[0].State
          );
          this.pinStatus = false;
          this.State = data[0].PostOffice[0].State;
          this.City = data[0].PostOffice[0].District;
        }
      });
    } else {
    }
  }
  storeMoreDetail(storeIndex) {
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
  checkingPin(pin) {
    console.log("last un");
    if (pin.target.value.length != 6 && pin.target.value.length != 0) {
      this.pinmessage = true;
    } else {
      this.onInputPin(pin);
    }
  }
}
