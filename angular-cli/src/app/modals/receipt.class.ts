import { Injectable } from "@angular/core";
import { Product, SalesDetail, UserDetails } from "../modals/app.interface";

@Injectable()
export class ReceiptClass {
  image: string = `
    data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOYAAABuCAYAAAAziW8OAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3YmRkNTU2Ni03MTUzLWJjNDItOTAwZC1jNjI5ODAyNDU4Y2UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTAwQ0M1QTVCRUQ0MTFFNzkyODRGODhBMDA2ODg1QTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTAwQ0M1QTRCRUQ0MTFFNzkyODRGODhBMDA2ODg1QTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowODcxMTQ1RTdFQjhFNzExOTg0RjlBMkE4REUzRDA3RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3YmRkNTU2Ni03MTUzLWJjNDItOTAwZC1jNjI5ODAyNDU4Y2UiLz4gPC9yZGY6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
    `;

  receiptHeader: string;

  receiptBody: string;

  receiptFooter: string;

  private generateHeader(transectionID: number, user: UserDetails) {
    this.receiptHeader =
      `
        <!DOCTYPE html>
        <html>
        <head>
        <title>Receipt</title>
        </head>
        <body style="margin: 0;font-size: 9px;">
            <div style="width:288px;border:1px solid black;font-family:Verdana, Geneva, Tahoma, sans-serif;text-align:center;">
                <div>
                   <img src="` +
      this.image +
      `" 
                   style=" margin: auto;width: 50%;padding: 10px;"/>
                   <p style="font-size:15px;margin-bottom:10px;">The Smartphone Store</p>
                   <p style="font-size: 16px;font-weight: bold;text-align: center;">SHIPGIG VENTURES</p>
                   <p style="font-size: 14px;line-height: 20px;">Sec-3,Noida<br>
                    Uttar Pradesh -201301<br>   
                    (M) 8588845898<br>
                    09AGTPA4886B1Z6
                    </p>
                    <p style="font-size:20px;font-weight:bold;">CASH BILL</p>
                    <div style="width:100%">
                    <span style="float:left;width: 50%;">Bill Number:` +
      transectionID +
      `</span>     <span style="float:left;width: 50%;">` +
      new Date().toLocaleDateString() +
      " " +
      new Date().toLocaleTimeString() +
      `</span>
                    </div>
                    <p><span class="space" style="padding-right:80px";>Staff ID:` +
      user.sysUser_ID +
      `</span>Staff Name:` +
      user.firstName +
      "" +
      user.lastName +
      `</p> 
                    </div>
        
                <div>
        
        
        
        `;
  }

  private generateBody(cart: Product[], totals: SalesDetail) {
    let tr: string = "";
    for (let i = 0; i < cart.length; i++) {
      tr +=
        `<tr>
                        <td>` +
        Number(i + 1) +
        `</td>   
                        <td>` +
        cart[i].productName +
        `</td>
                        <td>` +
        cart[i].qty +
        `</td>
                        <td>` +
        cart[i].unitPrice +
        `</td>
                        <td>` +
        cart[i].discount +
        `</td>
                        <td>` +
        cart[i].amount +
        `</td>
                    </tr>`;
    }

    this.receiptBody =
      `
            <table style="border-top: 1px #000000 dashed;border-bottom: 1px #000000 dashed;text-align: left;width:100%;">
            <tr> 
                <th style="border-bottom: 1px #000000 dashed;">S.No</th>  
                <th style="border-bottom: 1px #000000 dashed;">Item Name</th>
                <th style="border-bottom: 1px #000000 dashed;">Quantity</th>
                <th style="border-bottom: 1px #000000 dashed;">Price</th>
                <th style="border-bottom: 1px #000000 dashed;">Discount</th>
                <th style="border-bottom: 1px #000000 dashed;">Amount</th>
            </tr>
            ` +
      tr +
      `
            </table>

            <table style="border-style: dotted;border-width: 0px 0px 2px 0px; text-align: left;padding:10px 0px 10px 0px;width:100%;" >
                <tr>
                    <th style="padding-right: 170px;">SUBTOTAL</th>
                    <th> ₹ ` +
      totals.subTotal +
      `</th>
                </tr>
                <tr>
                    <th>TOTAL GST</th>
                    <th> ₹ ` +
      Number(totals.totalCGST + totals.totalSGST) +
      `</th>
                </tr>
            </table>

            <table style="border-style: dotted;border-width: 0px 0px 2px 0px;text-align: left;padding:10px 0px 10px 0px;width:100%;">
            <tr>
                <th>GST DETAILS:</th>
            <tr> 
                <th></th>
               
               
                <th>Tax Amount</th>
            </tr>
            <tr>    
                <td>CGST</td>
              
              
                <td>` +
      totals.totalCGST +
      `</td>
            </tr>
            <tr>
                <td>SGST</td>
               
                
                <td>` +
      totals.totalSGST +
      `</td>
            </tr>
            </table>

            <div style="border-bottom: 1px #000000 dashed;font-size: 15px;margin: 8px 0 0 0;">

                <h4 style="text-align: center;">TOTAL  ₹ ` +
      totals.grandTotal +
      `</h4>

            </div>
            `;
  }
  private generateFooter(paymentMode) {
    this.receiptFooter =
      `
                <p style="text-align: center; font-size:12px;";>Payment Mode:<b>
                ` +
      paymentMode +
      `</b></p>
                <p>Thanks For Visit</p>

                </div>
                </div>
                </body>
                </html>

                `;
  }

  public getReceipt(
    cart: Product[],
    transectionID: number,
    totals: SalesDetail,
    user: UserDetails
  ) {
    this.generateHeader(transectionID, user);
    this.generateBody(cart, totals);
    this.generateFooter(totals.paymentMode);
    return this.receiptHeader
      .concat(this.receiptBody)
      .concat(this.receiptFooter);
  }
}
