import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// import { MatToolbarModule } from '@angular/material';
import { User } from '../../base/core/models/user.model';

//import { UsersSpringService } from '../../base/core/services/users-spring.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Output() public sidenavToggle = new EventEmitter();
    currentUser: User;
    constructor(router: Router) {

    }

    ngOnInit() {

    }


    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }

}
