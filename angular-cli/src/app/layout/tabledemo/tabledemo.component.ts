import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-tabledemo',
  templateUrl: './tabledemo.component.html',
  styleUrls: ['./tabledemo.component.scss'],
  animations: [routerTransition()]
})
export class TabledemoComponent implements OnInit {

  dummyData: any

  constructor() {
    this.dummyData = [
      {
        "name": "John",
        "age": 30,
        "sex": "male",
        "Mobile": 9898989898,
        "Address": "abc"
      },
      {
        "name": "John",
        "age": 30,
        "sex": "male",
        "Mobile": 9898989898,
        "Address": "abc"
      },
      {
        "name": "John",
        "age": 30,
        "sex": "male",
        "Mobile": 9898989898,
        "Address": "abc"
      },
      {
        "name": "John",
        "age": 30,
        "sex": "male",
        "Mobile": 9898989898,
        "Address": "abc"
      }
    ]
  }

  ngOnInit() {
  }

}
