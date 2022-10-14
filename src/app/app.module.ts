import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './base/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RequestInterceptor } from './base/core/services/request.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
// import { HomeComponent } from './home/home.component';
import { AboutComponent } from './plugins/about/about.component';
//import { LoginComponent } from './base/login/login.component';
//import { LoginRouteGuard } from './base/login/login.guard';
//import { AuthorizationRouteGuard } from './base/login/authorization.guard';
import { AppRoutingModule } from './routing/app-routing.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
//import { UsersSpringService } from './base/core/services/users-spring.service';
//import { RegistrationService } from './base/core/services/registration.service';
import { AccountEventsService } from './base/core/services/account.events.service';
import { ErrorService } from './base/core/services/error.service';
import { ErrorComponent } from './base/error/error.component';
import { SharedModule } from './base/shared/shared.module';
import { FooterComponent } from './navigation/footer/footer.component';
//import { RegistrationComponent } from './base/registration/registration.component';
// import { EmailComponent } from './email/email.component';
// import { UserContactsListComponent } from './user-contacts/user-contacts-list/user-contacts-list.component';
// import { UserContactsSelectionListComponent } from './user-contacts/user-contacts-selection-list/user-contacts-selection-list.component';
// tslint:disable-next-line:max-line-length
// import { UserContactsSelectionDialogComponent } from './user-contacts/user-contacts-selection-dialog/user-contacts-selection-dialog.component';
// import { ContactDeleteDialogComponent } from './contact/contact-delete/contact-delete-dialog.component';
// import { PasswordComponent } from './password/password.component';
import { CoreModule } from './base/core/core.module';

//import { CommonService } from './base/core/services/common.service';
import { AngularLogService } from './base/core/services/angular-log.service';
import { AngularLogPublishersService } from './base/core/services/angular-log-publishers.service';
import { GoogleMapsModule } from '@angular/google-maps';
//import { MapComponent } from './plugins/map/map.component';

@NgModule({
    declarations: [
        AppComponent,
        AboutComponent,
        LayoutComponent,
        HeaderComponent,
        SidenavListComponent,
        //LoginComponent,
        //RegistrationComponent,
        ErrorComponent,
        FooterComponent
    ],
    entryComponents: [

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        MaterialModule,
        FlexLayoutModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        GoogleMapsModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: RequestInterceptor,
        multi: true,
    },
        //CommonService, 
        //UsersSpringService, 
        //RegistrationService, 
        //LoginRouteGuard, 
        //AuthorizationRouteGuard, 
        AccountEventsService, 
        ErrorService,
        AngularLogService,
		AngularLogPublishersService,
    ],
    bootstrap: [AppComponent, ErrorComponent]
})
export class AppModule { }
