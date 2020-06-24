import { Injectable } from "@angular/core";
import { ConstantValues } from "../constant-values";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';

@Injectable()  
export class VerifyService {
  services: any;
  data: any;

  constructor(private constantValues: ConstantValues, public http: HttpClient) {
    this.services = this.constantValues.urls;
  }

  public getToken(): string {
    return localStorage.getItem("token");
  }

  verify() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return new Promise(resolve => {
      this.http.post(this.services.verify, {}, httpOptions).subscribe(verifyStatus => {
        this.data = verifyStatus;
        resolve(this.data);
      });
    });
  }
  
}
