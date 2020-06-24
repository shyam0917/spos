import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class GlobalServiceService {
  private spinner = new BehaviorSubject<boolean>(true);
  currentSpinnerFlag = this.spinner.asObservable();
  createStore = new BehaviorSubject<boolean>(true);

  constructor() {}

  getSpinnerFlag(value) {
    this.spinner.next(value);
  }

  getStore(val) {
    this.createStore.next(val);
  }
}
