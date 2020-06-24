import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpServices } from "../../../http-service";
import { routerTransition } from "../../../router.animations";
import { UserRoleChecker } from "../../../user-role-service";
declare var alertify: any;

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.scss'],
  animations: [routerTransition()]
})
export class AddDetailsComponent implements OnInit {
  uomData: any;
  uoms: any = [];
  CategoryDescription: any = "";
  categoryName: any = "";
  toggleKey: string = "";

  constructor(public httpServices: HttpServices,
    private activeRoute: ActivatedRoute) {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.toggleKey = params['id'];
      }
    });
  }

  ngOnInit() {
    this.getUoms();
  }

  getUoms() {
    this.httpServices.getUoms().then((result: any) => {
      if (result.data.result != "null") {
        this.uoms = result.data.result;
      }
    });
  }

  addUom(myForm) {
    let c = this.uoms.filter(item => item.description == this.uomData);
    if (c.length == 0) {
      this.httpServices.addUoms(this.uomData).then((response: any) => {
        if (response.code == 0) {
          this.getUoms();
          myForm.resetForm();
          alertify.success("Measurement Unit Added Successfully");
        }
      });
    } else {
      alertify.error("Measurement Unit Already Exist");
    }
  }

  addCategory(myForm2) {
    let myData = myForm2.form.value;
    let categoryData = {
      p_categoryName: myData.cat,
      p_categoryDescription: myData.CategoryDescription
    };
    this.httpServices.create_category(categoryData).then((response: any) => {
      if (response.code == 0) {
        alertify.success("Category Added Successfully");
        myForm2.resetForm();
      }
      else {
        alertify.error("Internal Error Occurred");
      }

    });
  }

}
