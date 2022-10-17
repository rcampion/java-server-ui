import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../plugins/about/about.component';
//import { LoginComponent } from '../base/login/login.component';
import { ErrorComponent } from '../base/error/error.component';
// import { EmailComponent } from '../email/email.component';
//import { LoginRouteGuard } from '../base/login/login.guard';
//import { AuthorizationRouteGuard } from '../base/login/authorization.guard';
//import { RegistrationComponent } from '../base/registration/registration.component';
// import { UserContactsListComponent } from '../user-contacts/user-contacts-list/user-contacts-list.component';
//import { UsersListComponent } from '../base/users/users-list/users-list.component';
// import { PasswordComponent } from '../password/password.component';

const routes: Routes = [
	
	{ path: '',
        loadChildren: () => import("./../plugins/books/books.module").then(m => m.BooksModule) },

    { path: 'about', component: AboutComponent },
//    { path: 'register', component: RegistrationComponent },
//    { path: 'authenticate', component: LoginComponent },
//    { path: 'login', component: LoginComponent },
//    { path: 'logout', component: LoginComponent },
    { path: 'error', component: ErrorComponent },

	{ path: 'books',
        loadChildren: () => import("./../plugins/books/books.module").then(m => m.BooksModule) },

//	{ path: 'users',
//        loadChildren: () => import("./../base/users/users.module").then(m => m.UsersModule), canActivate: [LoginRouteGuard] },
 
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    { path: 'home',
        loadChildren: () => import('./../plugins/home/home.module').then(m => m.HomeModule)},

//    { path: 'settings',
//        loadChildren: () => import('./../plugins/settings/settings.module').then(m => m.SettingsModule)},

//    { path: 'profile',
//        loadChildren: () => import('./../plugins/profile/profile.module').then(m => m.ProfileModule)
//    }

];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules
        })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

