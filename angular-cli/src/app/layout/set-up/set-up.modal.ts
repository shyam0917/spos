import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpServices } from "./../../http-service";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SetupService } from "./set-up.service";

@Component({
  templateUrl: "./set-up.modal.html",
  styleUrls: ["./set-up.modal.scss"]
})
export class SetupModal implements OnInit {
  catId;
  gstForm: FormGroup;
  obj: any;
  error: any;
  isAdmin = false;
  datelength: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private httpService: HttpServices,
    private setupService: SetupService,
    private fb: FormBuilder
  ) {
    this.catId = [];
  }

  ngOnInit() {
    let data = JSON.parse(localStorage.getItem("userDetails"));
    console.log(data.code, "COde");
    if (data.code == "ADM" || data.code == "SADM") {
      this.isAdmin = true;
    }
    this.initializeForm();
    this.getGstCategory();
    this.change();
  }

  initializeForm() {
    this.gstForm = this.fb.group({
      HSN_No: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$")
        ])
      ],
      Item: [null, Validators.required],
      Item_Desc: [null],
      gst_Cat_ID: [null],
      igst: [null, Validators.required],
      sgst: [null],
      cgst: [null]
    });
  }

  getGstCategory() {
    this.httpService.getGstCategory().subscribe(category => {
      console.log(category)
      this.catId = category;
    });
  }

  closeFnction() {
    this.datelength = true;
  }

  change() {
    this.gstForm.get("igst").valueChanges.subscribe(value => {
      let gst = this.catId.find(obj => obj.GST == value);
      this.gstForm.get("gst_Cat_ID").setValue(gst.gst_Cat_ID);
      this.gstForm.get("sgst").setValue(gst.GST / 2);
      this.gstForm.get("cgst").setValue(gst.GST / 2);
    });
  }

  submit() {
    console.log("submit is ")
    var that = this;
    var form ={
      ...this.gstForm.value
    }

    let admin = { form  , isAdmin: this.isAdmin  };
    this.httpService.setGstTable(admin).subscribe(
      (response: any) => {
        this.setupService.modalReference.next("done");
        this.activeModal.close(false);
      },
      err => {
        this.error = err.error.sqlMessage;
      }
    );
  }
}
