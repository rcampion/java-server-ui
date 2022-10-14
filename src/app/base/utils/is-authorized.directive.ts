import { Directive, ElementRef, Input, OnInit} from '@angular/core';
import { UsersSpringService } from '../core/services/users-spring.service';

@Directive({
    selector: '[appIsAuthorized]',
    providers: [UsersSpringService]
})
export class IsAuthorizedDirective implements OnInit {
    @Input('appIsAuthorized') role: string;
    constructor(private elementRef: ElementRef, private loginService: UsersSpringService) {

    }
    ngOnInit(): void {
        if (this.role && this.role.trim() !== '' && !this.loginService.isAuthorized([this.role])) {
            const el: HTMLElement = this.elementRef.nativeElement;
            el.parentNode.removeChild(el);
        }
    }
}
