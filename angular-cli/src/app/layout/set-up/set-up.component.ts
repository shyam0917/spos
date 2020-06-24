import { SetupModal } from "./set-up.modal";
import { Component, OnInit } from "@angular/core";
import { Pagination } from "../../modals/pagination";
import { MatPaginator } from "@angular/material";
import {
  NgbModal,
  NgbActiveModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { HttpServices } from "../../http-service";
import { SetupService } from "./set-up.service";
import { UserRoleChecker } from "../../user-role-service";
import { FormGroup } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
// import { ConsoleReporter } from 'jasmine';
declare var alertify: any;

@Component({
  selector: "app-set-up",
  templateUrl: "./set-up.component.html",
  styleUrls: ["./set-up.component.scss"]
})
export class SetUpComponent extends Pagination implements OnInit {
  storeMessage: string = "";
  catId;
  modalRef;
  editHSN;
  info: any = {};
  isAdmin = false;
  toShow = false;
  datelength: boolean;
  gstForm: FormGroup;
  createStoreFormHide: boolean = true;
  mySimpleForm: FormGroup;
  form01: FormGroup;
  userRole: boolean = false;
  updateHSN: {
    Item: any;
    Item_Desc: any;
    HSN_No: any;
    igst: any;
    totalRecord: any;
    gst_ID: "";
    gst_Cat_ID: any;
    cgst: any;
    sgst: any;
  };
  dataFlag: boolean;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private setUpService: SetupService,
    public httpServices: HttpServices,
    public userRoleChecker: UserRoleChecker,
    public router: Router
  ) {
    super();
    this.catId = [];
    this.updateHSN = {
      Item: "",
      Item_Desc: "",
      HSN_No: "",
      igst: "",
      totalRecord: "",
      gst_ID: "",
      gst_Cat_ID: "",
      cgst: "",
      sgst: ""
    };
  }
  productInfo: any[];

  ngOnInit() {
    var admin = JSON.parse(localStorage.getItem("userDetails"));
    if (admin.code == "SADM" || admin.code == "ADM") {
      this.isAdmin = true;
      this.userRole = true;
    }
    this.fetchStore();
    this.setUpService.modalReference.subscribe(data => {
      if (data == "done") {
        alertify.success("User added Successfully");
        this.toShow = true;
        setTimeout(_ => (this.toShow = false), 1500);
        this.fetchStore();
      } else {
        return;
      }
    });
    this.getGstCategory();
  }

  getGstCategory() {
    this.httpServices.getGstCategory().subscribe(category => {
      this.catId = category;
    });
  }

  // update functionlity of hsn code
  openUpdateProductModal(update, info) {
    //this.info = info;
    this.updateHSN.Item = info.Item;
    this.updateHSN.Item_Desc = info.Item_Desc;
    this.updateHSN.HSN_No = info.HSN_No;
    this.updateHSN.igst = info.igst;
    (this.updateHSN.totalRecord = info.totalRecord),
      (this.updateHSN.cgst = info.cgst),
      (this.updateHSN.gst_Cat_ID = info.gst_Cat_ID),
      (this.updateHSN.sgst = info.sgst),
      (this.updateHSN.gst_ID = info.gst_ID);
    this.modalService
      .open(update, { size: "lg", backdrop: "static", keyboard: false })
      .result.then(
        result => { },
        reason => { }
      );
  }

  // submit button of update functionlity
  submit(form) {
    console.log("datra", form);
    let admin = { form, isAdmin: this.isAdmin };
    this.setUpService.updateData(admin).subscribe((response: any) => {
      if (response != "null") {
        this.storeMessage = "Store updated successfully";
        this.fetchStore();
        this.closeFnction();
        this.datelength = true;
        setTimeout(() => {
          this.storeMessage = "";
          this.modalService.dismissAll();
        }, 1000);
      }
    });
  }

  // delete functionlity of hsn code
  productNameForDeleteModal: any;
  openDeleteProduct(productDelete, form) {
    this.productNameForDeleteModal = form.Item;
    this.modalService.open(productDelete).result.then(
      result => {
        form.delete = 1;
        let admin = { form, isAdmin: this.isAdmin };
        this.deleteProduct(admin);
      },
      reason => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  deleteProduct(val) {
    this.setUpService.deleteData(val).subscribe((response: any) => {
      if (response.affectedRows === 1) {
        alertify.success("Deleted Successfully");
        this.fetchStore();
      } else {
        alertify.error("HSN Not Deleted");
      }
    });
  }

  closeFnction() {
    this.datelength = true;
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  openHsnForm() {
    this.modalRef = this.modalService.open(SetupModal);
    // this.modalRef.result.then(this.fetchStore())
  }
  fetchStore() {
    let data = {
      ...this.validPageOptions
    };
    this.httpServices.getGst(data).subscribe((res: any) => {
      this.productInfo = res;
      this.total = res[0].totalRecord;
    }, err => {
    });
  }
  // openUpdateProductModal(info) {
  //   this.editHSN = info;
  // }

  // change the serial number

  getSerialNumber(i) {
    return (
      i + (this.validPageOptions["page"] - 1) * this.validPageOptions["limit"]
    );
  }

  /*
    Method For Changing The Pagination
  */
  changePage(event: MatPaginator) {
    this.pageOptionsOnChange = event;
    if (this.total == 0) {
    }
    this.fetchStore();
  }
}
