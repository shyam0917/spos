import { Component } from '@angular/core';
import { routerTransition } from '../router.animations';

import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['not-found.component.scss'],
    animations: [routerTransition()]
})
export class NotFoundComponent { 
  routeParams;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    // this.routeParams = this.activatedRoute.snapshot.queryParams;
    
  }
}
