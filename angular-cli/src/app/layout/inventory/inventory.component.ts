import { Component, OnInit, HostListener } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { HttpServices } from "../../http-service";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { Storage } from "../../modals/app.class";
import { UserRoleChecker } from "../../user-role-service";
import { Location } from "@angular/common";
import { NguiAutoCompleteModule } from "@ngui/auto-complete";
import { ViewChild, ElementRef } from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { ThemeService } from "ng2-charts";
// import { CLIENT_RENEG_LIMIT } from 'tls';
const urlImage = "http://localhost:3000/uploadProductImage";
const urlFile = "http://localhost:3000/uploadProductFile";
declare var alertify: any;

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
  animations: [routerTransition()]
})
export class InventoryComponent implements OnInit {
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public photoUploader: FileUploader = new FileUploader({
    url: urlImage,
    itemAlias: "photo",
    allowedMimeType: [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/x-eps",
      "image/bmp",
      "application/illustrator",
      "image/tiff"
    ],
    autoUpload: false
  });

  validator = {};

  public fileUploader: FileUploader = new FileUploader({
    url: urlFile,
    itemAlias: "file",
    allowedMimeType: [
      // 'text/xml',
      "application/vnd.ms-excel",
      "application/vnd.oasis.opendocument.spreadsheet",
      "application/vnd.oasis.opendocument.spreadsheet-template",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template"
    ],
    autoUpload: true
  });
  files: any = [];
  prodName: any = "";
  info: any = {};
  loginInfo: any = {};
  productInfo: any = [];
  productList: any = {};
  gstItems: any = [];
  show = false;
  uoms: any = [];
  searchArray: any = [];
  searchBy: String;
  fullSearchArray: any = [];
  typeSearch: String;
  todayDate = new Date();
  searchByFlag: boolean;
  product_IDFlag: boolean;
  barcodeReader_IDFlag: boolean;
  UOM_IDFlag: boolean;
  subcategory_IDFlag: boolean;
  productNameFlag: boolean;
  haveDate: boolean = false;
  brandNameFlag: boolean;
  descriptionFlag: boolean;
  constrainsFlag: boolean;
  unitPriceFlag: boolean;
  supplier_idFlag: boolean;
  discountFlag: boolean;
  totalstockFlag: boolean;
  costPriceFlag: boolean;
  resultSuccessUpdate: boolean;
  resultSuccessAdd: boolean;
  moreDetailToggle: boolean = false;
  limit;
  offset;
  count;
  pageindex;
  uomData: any;
  file_Name: string = "";
  @ViewChild("closeBtn") closeBtn: ElementRef;
  modalReference: NgbModalRef;
  // categoryData: any = [];    //added by regan 02-august
  subcategoryData: any = []; //added by regan 02-august
  // category_ID: number = undefined; //added by regan 02-august
  storeData: number = undefined; //added by regan 02-august

  uploadedProductImageName: any; // added by regan aug-24
  uploadedProductFileName: any; // added by regan aug-
  dateMessage: boolean = false;
  datelength: boolean = false;
  showMsg: boolean = false;
  compaireVar: boolean = false;
  compairDateLength: boolean = false;
  anotherdate: string;
  SubcategoryName: string = "";
  SubcategoryDescription: string = "";
  isChooseFile: boolean = false;
  imagePath: string = "No File Chosen";
  localIndex: any;
  storeIndex: any;
  constructor(
    public httpServices: HttpServices,
    private modalService: NgbModal,
    private storage: Storage,
    public userRoleChecker: UserRoleChecker,
    private location: Location
  ) {
    this.offset = 0;
    this.limit = localStorage.getItem("Inventorylimit")
      ? localStorage.getItem("Inventorylimit")
      : 5;
    this.isChooseFile = false;
  }

  ngOnInit() {
    this.loginInfo = this.storage.getObject("userDetails");
    this.getAllProduct();
    // this.getGstItems();
    if (this.userRoleCheck("inventory", "read") == false) {
      this.location.back();
    }

    this.getUoms();
    this.searchTypeFn("cat");
    // this.fetchCategory();
    this.fetchStore();
  }

  // code to prevent image load on drag
  @HostListener("body:dragover", ["$event"])
  onBodyDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener("body:drop", ["$event"])
  onBodyDrop(event: DragEvent) {
    event.preventDefault();
  }

  // forwardPage() {
  //   if (this.offset >= this.count - this.limit) {
  //     return;
  //   }
  //   this.offset += this.limit;
  //   this.getAllProduct(this.offset);
  // }

  // goBackward() {
  //   if (this.offset <= 0) {
  //     return;
  //   }
  //   this.offset -= this.limit;
  //   this.getAllProduct(this.offset)
  // }

  handlePage(event) {
    if (this.limit == event.pageSize) {
      this.moreDetailToggle = false;
    }
    this.limit = event.pageSize;
    localStorage.setItem("Inventorylimit", this.limit);
    let idx = event.pageIndex ? event.pageIndex * this.limit + 1 : 1;
    this.getAllProduct(event.pageIndex * event.pageSize, idx);
  }

  // fetchCategory(){
  //   this.httpServices.fetch_categoryStore().then((data:any)=>{
  //     this.fetchSubcategory
  //   })
  // }
  categoryName: any;
  categoryID: any;
  fetchStore() {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let userID = userDetails.sysUser_ID;
    if (userID == undefined) {
      return;
    }
    let obj = { userID: userID };
    this.httpServices.fetch_store(obj).then((data: any) => {
      this.storeData = data.data.result[0].categoryName;
      this.categoryName = this.storeData;
      this.categoryID = data.data.result[0].category_ID;
      this.fetchSubcategory();
    });
  }

  watchMe(obj) {
    return obj.subcategoryName;
  }

  subcategory_ID: number = undefined;
  fetchSubcategory() {
    this.httpServices
      .fetch_subcategoryStore(this.categoryID)
      .then((data: any) => {
        // this.subcategoryData = data.data.result;
        this.subcategoryData = [];
        if (data.data.result != "null") {
          let nsubcategoryData = data.data.result;
          // console.log('abc', nsubcategoryData.length);
          // console.log('def', nsubcategoryData);

          for (let i = 0; i < nsubcategoryData.length; i++) {
            if (nsubcategoryData[i].category_ID == this.categoryID) {
              let obj: any = {};
              obj.subcategoryName = nsubcategoryData[i].subcategoryName;
              obj.category_ID = nsubcategoryData[i].category_ID;
              obj.subcategory_ID = nsubcategoryData[i].subcategory_ID;
              this.subcategoryData.push(obj);
            }
          }
        }
        console.log('data2//.....', this.subcategoryData);
      });
  }

  searchTypeFn(type) {
    if (!type) {
      return;
    }
    this.httpServices.getList(type).then((result: any) => {
      if (result.data.result != "null") {
        this.fullSearchArray = result.data.result;
      }

      if (type == "cat") {
        if (result.data.result !== null && result.data.result !== "null") {
          this.searchArray = result.data.result.map(m => m.Item);
          this.searchBy = null; // added aug 20
          this.typeSearch = "cat";
        }
      } else if (type == "gst_id") {
        if (result.data.result != null && result.data.result != "null") {
          //created by regan august-01
          this.searchArray = result.data.result.map(m => m.gst_ID);
          this.searchBy = null; // added aug 20
          this.typeSearch = "gst_id";
        }
      } else {
        if (result.data.result != null && result.data.result != "null") {
          //created by regan august-01
          this.searchArray = result.data.result.map(m => m.HSN_No);
          this.searchBy = null; // added aug 20
          this.typeSearch = "HSN_ID";
        }
      }
    });
  }

  searchGSTHSN(s) {
    if (this.typeSearch == "cat") {
      let tempArray = this.fullSearchArray.filter(function (arr) {
        return s == arr.Item;
      });
      this.info.HSN_ID =
        tempArray.length == 0 ? undefined : tempArray[0].HSN_No;
      this.info.gst_ID =
        tempArray.length == 0 ? undefined : tempArray[0].gst_ID;
      this.info.category =
        tempArray.length == 0 ? undefined : tempArray[0].Item;
    } else if (this.typeSearch == "gst_id") {
      let tempArray = this.fullSearchArray.filter(function(arr) {
        return s == arr.gst_ID;
      });
      this.info.HSN_ID =
        tempArray.length == 0 ? undefined : tempArray[0].HSN_No;
      this.info.gst_ID =
        tempArray.length == 0 ? undefined : tempArray[0].gst_ID;
      this.info.category =
        tempArray.length == 0 ? undefined : tempArray[0].Item;
    } else {
      let tempArray = this.fullSearchArray.filter(function (arr) {
        return s == arr.HSN_No;
      });
      this.info.HSN_ID =
        tempArray.length == 0 ? undefined : tempArray[0].HSN_No;
      this.info.gst_ID =
        tempArray.length == 0 ? undefined : tempArray[0].gst_ID;
      this.info.category =
        tempArray.length == 0 ? undefined : tempArray[0].Item;
    }
  }

  // add modal code starts
  closeResult: string;
  openAddProductModal(add) {
    if (this.photoUploader.queue.length) {
      this.photoUploader.queue = [];
    }
    this.searchTypeFn("cat"); //added by regan august-20
    this.uploadedProductImageName = "";
    this.info = {};
    this.searchBy = "";
    this.searchByFlag = true;
    this.product_IDFlag = true;
    this.barcodeReader_IDFlag = true;
    this.UOM_IDFlag = true;
    this.subcategory_IDFlag = true;
    this.productNameFlag = true;
    this.brandNameFlag = true;
    this.descriptionFlag = true;
    this.constrainsFlag = true;
    this.unitPriceFlag = true;
    this.supplier_idFlag = true;
    this.discountFlag = true;
    this.totalstockFlag = true;
    this.costPriceFlag = true;
    this.resultSuccessAdd = false;
    this.imagePath = "No File Chosen";
    this.modalService
      .open(add, { size: "lg", backdrop: "static", keyboard: false })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  getUoms() {
    this.httpServices.getUoms().then((result: any) => {
      if (result.data.result != "null") {
        this.uoms = result.data.result;
      }
    });
  }

  private getDismissReason(reason: any): string {
    this.datelength = true;
    this.dateMessage = true;
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  //add modal code endsng

  // update modal code starts
  closeResult_update: string;
  updateModelDate: string;

  openUpdateProductModal(update, info) {
    if (this.photoUploader.queue.length) {
      this.photoUploader.queue = [];
    }
    this.haveDate = false;
    var closeRef = JSON.parse(JSON.stringify(info.expiryDate));
    var reftotalStock = JSON.parse(JSON.stringify(info.totalstock));
    var ipDate = new Date(closeRef);
    if (info.supplier_ID == 0) {
      info.supplier_ID = null;
    }
    if (info.discount == 0) {
      info.discount = null;
    }
    if (info.barcodeReader_ID == 0) {
      info.barcodeReader_ID = null;
    }
    var ipDate = new Date(info.expiryDate);
    ipDate.setDate(ipDate.getDate() + 1);
    this.imagePath = "No File Chosen";
    this.updateModelDate = new Date(ipDate).toISOString().split("T")[0];
    info["expirydate"] = this.updateModelDate;
    if (info["expirydate"].length == 10) {
      if (this.todayDate > ipDate) {
        //  this.dateMessage = false;
        this.haveDate = true;
      } else {
        this.haveDate = false;
      }
      this.datelength = true;
      this.dateMessage = true;
    }
    info["totalStock"] = reftotalStock;

    this.info = info;
    this.searchBy = info.category;
    this.uploadedProductImageName = "";
    this.searchByFlag = info.barcodeReader_ID == undefined ? false : true;
    this.product_IDFlag = info.product_ID == undefined ? false : true;
    this.barcodeReader_IDFlag =
      info.barcodeReader_ID == undefined ? false : true;
    this.UOM_IDFlag = info.UOM_ID == undefined ? false : true;
    this.subcategory_IDFlag = info.subcategory_ID == undefined ? false : true;
    this.productNameFlag = info.productName == undefined ? false : true;
    this.brandNameFlag = info.brandName == undefined ? false : true;
    this.descriptionFlag = info.description == undefined ? false : true;
    this.constrainsFlag = info.constrains == undefined ? false : true;
    this.unitPriceFlag = info.unitPrice == undefined ? false : true;
    this.supplier_idFlag = info.supplier_ID == undefined ? false : true;
    this.discountFlag = info.discount == undefined ? false : true;
    this.totalstockFlag = info.totalstock == undefined ? false : true;
    // this.costPriceFlag = true;
    this.costPriceFlag = info.costPrice == undefined ? false : true;
    this.resultSuccessUpdate = false;
    this.modalService
      .open(update, { size: "lg", backdrop: "static", keyboard: false })
      .result.then(
        result => {
          this.closeResult_update = `Closed with: ${result}`;
          this.getAllProduct();
        },
        reason => {
          this.closeResult_update = `Dismissed ${this.getDismissReason_update(
            reason
          )}`;
        }
      );
  }

  private getDismissReason_update(reason: any): string {
    this.typeSearch = "cat";
    this.getAllProduct();
    //  this.searchArray=[]
    this.datelength = true;
    this.dateMessage = true;
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  getAllProduct(offset = 0, idx = 1) {
    let param = {
      p_limit: this.limit,
      p_offset: offset,
      p_userId: this.loginInfo.sysUser_ID,
      p_productName: this.prodName ? this.prodName : ""
    };
    if (this.prodName) {
      this.pageindex = 0;
    }
    let arr = [];
    Promise.all([
      this.httpServices.getProduct(param),
      this.httpServices.getProductCount(param)
    ]).then((response: any) => {
      let obj = {};
      if (
        response[0].data.code === 0 &&
        response[1] &&
        response[1].result
        // response[1].result["COUNT(*)"]
      ) {
        obj["list"] = response[0].data.result.map((item, index) => {
          var eventa = new Date(item.expiryDate).toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
          });
          item.expiryDate = eventa;
          return { ...item, pos: index + idx };
        });
        obj["count"] = response[1].result["COUNT(*)"];
        this.productInfo = obj["list"];
        this.count = obj["count"];
      }
    });
  }

  getMyFiles() {
    let files = this.getFiles();
    let fileArr = [];
    files.forEach((file, index) => {
      let splitImage = file.name.split(".");
      let fname = splitImage[0];
      let extension = splitImage[1];
      if (fname.length > 10) {
        fname = fname.substring(0, 10);
        this.file_Name = fname + index + "." + extension;
      } else {
        this.file_Name = fname + index + "." + extension;
      }
      fileArr.push(this.file_Name);
    });
    this.uploadedProductImageName =
      files.length && files.length > 1 ? fileArr.join(",") : fileArr[0];
    // console.log(this.uploadedProductImageName);
  }

  getFiles() {
    let array = this.photoUploader.queue.map(fileItem => {
      return fileItem.file;
    });
    for (let index = 0; index < array.length; index++) {
      for (let i = index + 1; i < array.length; i++) {
        if (array[i].name == array[index].name) {
          alertify.error("Duplicate Images Removed");

          this.photoUploader.queue.splice(i, i);
          array.splice(i, i);
        }
      }
    }
    return array;
  }

  uploadMultipleImages() {
    let files = this.getFiles();
    const formData = new FormData();
    files.forEach(file => {
      formData.append("uploads", file.rawFile, file.name);
    });
    this.httpServices.sendImages(formData).subscribe(
      res => {
        if (res) {
          alertify.success("Image uploaded");
        }
      },
      err => {
        alertify.error("Internal Error Occured While Image Upload");
      }
    );
  }

  onActionForPhotos() {
    this.uploadedProductImageName = "";
    this.photoUploader.onAfterAddingFile = photo => {
      photo.withCredentials = false;
    };
    this.photoUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any
    ) => {
      this.uploadedProductImageName = item.file.name;
      if (response.length == 70) {
        alertify.error("Uploaded Failed Duplicate Name!");
      } else {
        this.imagePath = this.uploadedProductImageName;
        alertify.success("Uploaded Successfully");
      }
      // response.length == 70
      //   ? alertify.error("Uploaded Failed Duplicate Name!")
      //   : (
      //     this.imagePath = "No File Chosen";
      //     alertify.success("Uploaded Successfully")
      //   )
    };
    this.photoUploader.onWhenAddingFileFailed = item => {
      this.imagePath = "Invalid Image Format";
      alertify.error("Only Images Are Allowed!");
    };
  }

  onActionForFiles() {
    this.uploadedProductFileName = "";
    this.fileUploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };
    this.fileUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any
    ) => {
      this.uploadedProductFileName = item.file.name;
      alertify.success("Uploaded successfully");
    };
    this.fileUploader.onWhenAddingFileFailed = _ => {
      alertify.error("Only excel files are allowed");
    };
  }

  addProduct(val, updateFlag) {
    let productInfo = {
      p_productId: 0,
      p_storeID: this.loginInfo.store_ID,
      p_image_path: this.uploadedProductImageName,
      p_sysUser_ID: this.loginInfo.sysUser_ID,
      p_barcodeReaderId: val.barcodeReader_ID,

      p_UomId: val.UOM_ID,
      p_productName: val.productName,
      p_brandName: val.brandName,
      p_description: val.description,

      p_constrains: val.constrains,
      p_unitPrice: val.unitPrice,
      p_subcategory_ID: val.subcategory_ID,
      p_category: val.category,
      p_gstId: val.gst_ID,
      p_supplierId: val.supplier_ID,
      p_discount: val.discount,
      p_HSN_ID: val.HSN_ID,
      p_Happy_Hours: 0,
      p_costPrice: val.costPrice,
      p_totalstock: updateFlag ? val.totalStock : val.totalstock,
      p_expirydate: updateFlag ? val.expirydate : val.expiryDate,
      p_generated_product_id: this.generatePrimaryKey(
        this.loginInfo.store_ID,
        this.loginInfo.sysUser_ID
      )
    };

    if (updateFlag) {
      productInfo.p_productId = val.product_ID;
    }
    if (val) {
      this.httpServices.addUpdateProduct(productInfo).then((userdata: any) => {
        console.log("remove it", userdata);
        if (userdata.data.code === 0) {
          if (userdata.data.result == 1) {
            alertify.success("Product Updated Successfully");
            // this.resultSuccessUpdate = true;
            // setTimeout(() => {
            //   this.resultSuccessUpdate = false;
            // }, 1000);
            if (this.photoUploader.queue.length) {
              this.uploadMultipleImages();
            }
          } else {
            alertify.success("Product Added Successfully");
            // this.resultSuccessAdd = true;
            if (this.photoUploader.queue.length) {
              this.uploadMultipleImages();
            }
            setTimeout(() => {
              this.resultSuccessAdd = false;
            }, 2000);
            this.info = {};
            this.searchBy = "";
            this.searchByFlag = true;
            this.product_IDFlag = true;
            this.barcodeReader_IDFlag = true;
            this.UOM_IDFlag = true;
            this.subcategory_IDFlag = true;
            this.productNameFlag = true;
            this.brandNameFlag = true;
            this.descriptionFlag = true;
            this.constrainsFlag = true;
            this.unitPriceFlag = true;
            this.supplier_idFlag = true;
            this.discountFlag = true;
            this.totalstockFlag = true;
          }
          this.getAllProduct();
        } else {
          if (userdata.data.code === 1) {
            alertify.error(userdata.data.result);
          }
        }
      });
    }
  }

  productNameForDeleteModal: any;
  openDeleteProduct(productDelete, pInfo) {
    this.productNameForDeleteModal = pInfo.productName;

    this.modalService.open(productDelete).result.then(
      result => {
        this.deleteProduct(pInfo);
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  deleteProduct(val) {
    let delProductInfo = {
      p_productId: val.product_ID,
      p_store_Id: this.loginInfo.store_ID,
      p_userId: this.loginInfo.sysUser_ID
    };
    this.httpServices.deleteProduct(delProductInfo).then((response: any) => {
      if (response.data.code === 0) {
        this.getAllProduct();
      } else {
      }
    });
  }

  generatePrimaryKey(store_ID, user_ID) {
    let storeID = "00000000" + store_ID + "" + user_ID;
    let storeID8Digits = storeID.substr(storeID.length - 8);
    let primaryKey = storeID8Digits + Date.now();
    return String(primaryKey);
  }

  userRoleCheck(param, btn_type) {
    return this.userRoleChecker.userRoleChekerFunction(param, btn_type);
  }

  // productNameFlag = false
  checkValidation(name, val) {
    // this.productNameFlag = false;
    if (val && val.match(/[!@#$%^&*(),.?":{}|<>]/gi)) {
      switch (name) {
        case "prodName":
          this.validator["prodName"] = true;
          break;
        case "desc":
          this.validator["desc"] = true;
          break;
        case "const":
          this.validator["const"] = true;
          break;
        case "brandName":
          this.validator["brandName"] = true;
          break;
      }
    } else {
      this.validator[name] = false;
    }
  }
  checkSearchButton(value) {
    if (value == "") {
      this.getAllProduct();
    }
  }

  onDateChange(event) {
    this.haveDate = false;
    if (event.target.value.length > 1) {
      this.showMsg = true;
    }
    if (new Date(event.target.value) < this.todayDate) {
      this.compaireVar = true;
    } else {
      this.compaireVar = false;
    }
    if (this.compaireVar == true) {
      this.dateMessage = false;
    } else {
      this.dateMessage = true;
    }
  }
  onDateChange2(data) {
    this.anotherdate = data.target.value;
    if (data.target.value.length > 10 || this.anotherdate == "") {
      this.compairDateLength = true;
    } else {
      this.compairDateLength = false;
    }
    if (this.compairDateLength == true) {
      this.datelength = false;
    } else {
      this.datelength = true;
    }
  }
  closeFnction() {
    this.datelength = true;
  }

  //Add Subcategory in the product
  addSubCategory(event) {
    let count = this.subcategoryData.filter(
      item => item.subcategoryName == this.SubcategoryName
    );
    if (count.length == 0) {
      let modalData = {
        p_category_ID: this.categoryID,
        p_subcategoryName: this.SubcategoryName,
        p_Description: this.SubcategoryDescription
      };

      this.httpServices.create_subcategory(modalData).then((response: any) => {
        if (response.code == 0) {
          alertify.success("SubCategory Added Successfully");
          this.fetchSubcategory();
          // this.msgOnAddSubCat = response.data.result;
          // setTimeout(() => {
          //   this.msgOnAddSubCat = "";
          // }, 1000);
        } else {
          alertify.error("Internal Error Occured");
        }
        // this.createStoreFormHide = false;
      });
      this.SubcategoryName = "";
      this.SubcategoryDescription = "";
    } else {
      alertify.error("SubCategory Already Exists");
      this.SubcategoryName = "";
      this.SubcategoryDescription = "";
    }
  }

  // open modal to add measurement
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          if (result == "Save") {
            let c = this.uoms.filter(item => item.description == this.uomData);
            if (c.length == 0) {
              this.httpServices.addUoms(this.uomData).then((response: any) => {
                if (response.code == 0) {
                  this.getUoms();
                  this.uomData = "";
                  alertify.success("Measurement Unit Added Successfully");
                }
              });
            } else {
              alertify.error("Measurement Unit Already Exist");
            }
          } else {
            this.uomData = "";
          }
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  ontypeDate(event, dateData) {
    setTimeout(() => {
      if (dateData == undefined || event.target.value == "") {
        this.showMsg = true;
        this.datelength = false;
        this.dateMessage = true;
      }
    }, 100);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
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
}
