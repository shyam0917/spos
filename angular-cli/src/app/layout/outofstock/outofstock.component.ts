import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-outofstock',
  templateUrl: './outofstock.component.html',
  styleUrls: ['./outofstock.component.scss'],
  animations: [routerTransition()]
})
export class OutofstockComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
