import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantValues } from '../../constant-values';
@Injectable({
    providedIn: 'root'
})

export class SetupService {
    modalReference = new BehaviorSubject(null);
    services: any;

    constructor(public http:HttpClient , private constantValues: ConstantValues, ){
        this.services = this.constantValues.urls;
    }

    updateData(info){
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          }; 
          return this.http.post(this.services.setGstTable, info, httpOptions)
    }

    deleteData(info){
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          }; 
          return this.http.post(this.services.setGstTable, info, httpOptions)
    }
}