
import { Injectable } from '@angular/core';




  @Injectable()
  export class Inventory{
    constructor(){}
    public product_ID: number=0;
    public store_ID: number=0;
    public sysUser_ID:number=0;
    public barcodeReader_ID:string=null;
    public UOM_ID:number=0;
    // public uomDescription:string;
    public productName:string=null;
    public brandName:string=null;
    public description:string=null;
    public constrains:string="NA";
    public unitPrice:number=0;
    public category:string =null;
    public gst_ID:number=0;
    public supplier_ID:number=0;
    public discount:number=0;
    public createdOn: string="";
    public modifiedOn:string="";
    public deletedOn:string="";
    public isDeleted: number= 0;
    public deletedBy:number=0;
    public HSN_ID:string;
    public happyHours:boolean=false;
    public expiryDate:string="";
    public deleteReason:string=null;
    public costPrice:number=0;
    public totalstock:number=0;
    public modifiedBy:number=0;
  }

  @Injectable()
  export class Invoice{
    constructor(){}
    invoice_ID:number=0;
    store_ID:number=0;
    transaction_ID:number=0;
    product_ID:number=0;
    quantity:number=0;
    discount:number=0;
    // createdOn:string=this.globalSer.getDefaultDateTime();
    // modifiedOn:string=this.globalSer.getDefaultDateTime();
    // deletedOn:string=this.globalSer.getDefaultDateTime();
    isDeleted: number= 0;
    isReturned: number= 0;
    // returnedOn:string=this.globalSer.getDefaultDateTime();
    deletedBy:number=0;
    unitPrice:number=0;
    modifiedBy:number=0;
  
  }

  @Injectable()
  export class Storage {
    public setItem(key: string, item: string) {
      localStorage.setItem(key, item);
    }
    public getItem(key: string): string {
      return localStorage.getItem(key);
    }
  
    public setObject(key: string, item: any) {
      localStorage.setItem(key, JSON.stringify(item)); 
    }
  
    public getObject(key: string): any {
      return JSON.parse(localStorage.getItem(key)||'');
    }
  
    public clearAll(){
      localStorage.clear();
    }
  }
  