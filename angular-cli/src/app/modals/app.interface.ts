


export interface Product {
  delete:any;
  serial:number;
  HSN_ID: number;
  UOM_ID: number;
  barcodeReader_ID: string
  brandName: string;
  category: string;
  cgst:number;
  contrains:string;
  description: string;
  discount:number;
  happyHours:boolean;
  productName: string;
  product_ID:number;
  sgst:number;
  supplier_ID:number;
  totalstock:number;
  unitPrice:number;
  qty: number;
  amount:number;
 }

export interface UserDetails{
    
  sysUser_ID :number,
  store_ID  :number,
  role :string,
  firstName :string,
  middleName :string,
  lastName: string,
  email :string,
  userName: string,
  password:string,
  mobile: number,
}



export interface UserOptions {
  username: string,
  password: string
}
export interface KeyValuePair {
  key: string,
  value: string;
}
export interface Pages {
  title: string;
  name: string;
  component: any;
}

export interface GSTItem{
  gst_ID:number;
  Item:string;
  gst_Cat_ID:number;
  HSN_No:string;
}

export interface UOM{
  UOM_ID:number;
  description:string;
}
export interface SalesDetail{
  totalQty :number;
  totalSGST:number;
  totalCGST:number;
  subTotal :number;
  grandTotal:number;
  discount:number;
  specialDiscount:number;
  paymentMode:string;
  transactionType:string;
}



export class Transaction{
  store_ID:number;
  transaction_ID:number;
  sysUser_ID:number;
  custUser_ID:string;
  discount:number;
  specialDiscount:number;
  GST:number;
  SGST:number;
  CGST:number;
  totalAmount:string;
  paymentMode:string;
  transactionType:string;
  createdOn:Date;
  modifiedOn:Date;
  deletedOn:Date;
  isDeleted:boolean;
  deletedBy:number;
  isReturned:boolean;
  returnDate:Date;
  isVoid:boolean;
  voidDate:Date;
  itemCount:number;
  modifiedBy:number;
  totalQty:number;
}
