import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//import { UsersSpringService } from './base/core/services/users-spring.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'angular-ts-client';

    //userService: UsersSpringService;

  constructor(router: Router) {
    const self = this;
  }
  
  ngOnInit() {
    //this.userService.populate();
  }

}

