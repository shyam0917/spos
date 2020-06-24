import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as jsPDF from 'jspdf';
// import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  animations: [routerTransition()]
})
export class SalesComponent implements OnInit {


  billData: any = {};

  fontFamily: any = [];
  textAlignment: any = [];

  fontSize: any = 30;

  indexFontFamily: any = 0;
  indexTextAlign: any = 0;

  imgUrl: any = "http://placehold.it/180";

  constructor(private modalService: NgbModal) {
    this.fontSize = 30;
    this.billData = [
      {
        "header": 'Header Line 1',
        "fontSize": 30,
        "value": "ABC enterprises",
        "key": "storeName",
        "fontFamily": "sans-serif"
      },
      {
        "header": 'Header Line 2',
        "fontSize": 20,
        "value": "xyz addresss",
        "key": "address",
        "fontFamily": "sans-serif"
      },
      {
        "header": 'Header Line 3',
        "fontSize": 20,
        "value": "Uttar Pradesh",
        "key": "state",
        "fontFamily": "sans-serif"
      },
      {
        "header": 'Header Line 4',
        "fontSize": 20,
        "value": "(M) 9420420420",
        "key": "mobile",
        "fontFamily": "sans-serif"
      },
      {
        "header": 'Header Line 5',
        "fontSize": 20,
        "value": "09545AD5SD54",
        "key": "billPin",
        "fontFamily": "sans-serif"
      },
      {
        "header": 'Header Line 6',
        "fontSize": 20,
        "value": "CASH BILL",
        "key": "paymentType",
        "fontFamily": "sans-serif"
      },
      
    ];
  }

  ngOnInit() {
    this.fontFamily = ['sans-serif', 'cursive', 'fantasy', 'inherit', 'initial', 'monospace', 'serif', 'unset'];
    this.textAlignment = ['Left Aligned', 'Center Aligned', 'Right Aligned'];
  }

  plus(index) {
    this.billData[index].fontSize = this.billData[index].fontSize + 1;
  }

  minus(index) {
    if (this.billData[index].fontSize > 1)
      this.billData[index].fontSize = this.billData[index].fontSize - 1;
  }

  // style modal code starts
  closeResult: string;
  headerLineIndex: any = 0;

  styleModal(add, index) {
    this.headerLineIndex = index;
    this.modalService.open(add).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    this.indexFontFamily = 0;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getFontFamily(index, val) {
    this.indexFontFamily = index;
    this.billData[this.headerLineIndex].fontFamily = val;
    // console.log("afterEdit--", this.billData);
  }

  getTextAlign(index, val) {
    this.indexTextAlign = index;
    // console.log("afterEdit--", this.billData);
  }

  //style modal code ends


  // file upload starts

  readURL(input) {
    // debugger
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        this.imgUrl = e.target.result;
      }.bind(this);

      reader.readAsDataURL(input.files[0]);
    }
  }

  // file upload ends

  // pdf convert starts
  generatePDF() {
    var doc = new jsPDF();
    var imgData = this.imgUrl;
    doc.addImage(imgData, 'JPEG', 50, 20, 100, 20); 
    var space = 40;
    for (var val in this.billData) {
      space = space + 10;
      doc.setFont(this.billData[val].fontFamily);
      doc.setFontSize(this.billData[val].fontSize);
      doc.text(105, space, this.billData[val].value, null, null, 'center');
    }

    doc.save('Test.pdf');
  }

  // pdf convert ends

}
