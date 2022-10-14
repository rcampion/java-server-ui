import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
//import { UsersSpringService } from '../../base/core/services/users-spring.service';

@Component({
    selector: 'app-sidenav-list',
    templateUrl: './sidenav-list.component.html',
    styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
    //loginService: UsersSpringService;
    @Output() sidenavClose = new EventEmitter();

    constructor(router: Router) {
 
    }

    ngOnInit() {
    }

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    }

}
