import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  animations: [routerTransition()]
})
export class PurchaseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
