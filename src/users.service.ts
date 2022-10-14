import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginationPropertySort } from '../interface/pagination';
import { map, catchError } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { User } from './../models/user.model';
import { Account } from './../models/account.model';

import { JwtService } from './jwt.service';
import { ApiService } from './api.service';

import { ErrorService } from './error.service';
import { ErrorHandlerService } from './error-handler.service';

import { AccountEventsService } from './account.events.service';
import { SecurityToken } from '../models/securityToken';
import { Authority } from '../models/authority.model';
import * as AppUtils from '../../utils/app.utils';

import { DataSharingService } from '../../core/services/datasharing.service';

import jwt_decode from 'jwt-decode';

import { AngularLogService } from '../../core/services/angular-log.service';

import { CookieService } from 'ngx-cookie-service';
import { AppMessage } from '../models/appmessage.model';

//import { application } from 'application';

@Injectable({
	providedIn: 'root'
})
export class UsersService {
	//public clientId = 'newClient';
	//public redirectUri = environment.redirectUri;

	account: Account = new Account();

	private user: User = new User();

	private currentUserSubject = new BehaviorSubject<User>({} as User);

	public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

	private isAuthenticatedSubject = new ReplaySubject<boolean>(1);

	public isAuthenticated = this.isAuthenticatedSubject.asObservable();

	error: string;

	constructor(private logger: AngularLogService,
		private http: HttpClient,

		private apiService: ApiService,

		private jwtService: JwtService,

		private errorService: ErrorService,

		private errorHandlerService: ErrorHandlerService,

		private accountEventService: AccountEventsService,

		private dataSharingService: DataSharingService,

		private router: Router,

		private cookieService: CookieService) { }

	public getData = (route: string) => {
		return this.http.get(this.createCompleteRoute(route, environment.api_url), this.generateHeaders());
	}

	public create = (route: string, body) => {
		return this.http.post(this.createCompleteRoute(route, environment.api_url), body, this.generateHeaders());
	}

	public update = (route: string, body) => {
		return this.http.put(this.createCompleteRoute(route, environment.api_url), body, this.generateHeaders());
	}

	public delete = (route: string) => {
		return this.http.delete(this.createCompleteRoute(route, environment.api_url), this.generateHeaders());
	}

	public send = (route: string, formData) => {
		const headers = new HttpHeaders(
			{
				//'Content-Type': 'multipart/form-data',
				//'Accept': 'application/json'
				'Access-Control-Allow-Credentials': 'true',
				'Authorization': 'Bearer ' + Cookie.get('access_token')
			}
		);
		return this.http.post<any>(this.createCompleteRoute(route, environment.api_url), formData, {
			headers: headers
		});
	}

	public sendMessage = (route: string, message: AppMessage) => {
		const json = JSON.stringify(message);
		const test = this.createCompleteRoute(route, environment.api_url);
		console.log(test);
		return this.http.post<any>(this.createCompleteRoute(route, environment.api_url), json,
			this.generateHeaders());
	}
	
    authenticate(userName: string, password: string): Observable<Account> {

        const headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        );

        // tslint:disable-next-line:max-line-length
        // return this.http.post(AppUtils.BACKEND_API_ROOT_URL + AppUtils.BACKEND_API_AUTHENTICATE_PATH, JSON.stringify({ login: userName, password: password }), {
        const route = 'authenticate';
        return this.http.post(this.createCompleteRoute(route, environment.api_url),
            JSON.stringify({ login: userName, password: password }), {
                headers: headers,
                observe: 'response'
            })

            // tslint:disable-next-line:max-line-length
            // return this.http.post(AppUtils.BACKEND_API_ROOT_URL + AppUtils.BACKEND_API_AUTHENTICATE_PATH, JSON.stringify({ login: userName, password: password }), {observe: 'response'})
            .pipe(

                catchError((error: any) => {
                    if (error.status === 401) {
                        // return Observable.throw('Unauthorized');
                        this.errorService.changeMessage('Unauthorized request! Username/Password is invalid.');
                        return throwError(
                            'Unauthorized, Username / Password are invalid.');
                    } else {
                        if (error.status === 403) {
                            // return Observable.throw('Unauthorized');
                            this.errorService.changeMessage('Unauthorized request!');
                            return throwError(
                                'Unauthorized');

                        } else {
                            this.errorService.changeMessage(error.message);
                            return throwError(
                                'Unknown');
                        }
                    }
                    // do any other checking for statuses here
                }),


                map((res: any) => {


                    const securityToken: SecurityToken = new SecurityToken(
                        {
                            publicSecret: res.headers.get(AppUtils.HEADER_X_SECRET),
                            securityLevel: res.headers.get(AppUtils.HEADER_WWW_AUTHENTICATE)
                        }
                    );

                    localStorage.setItem(AppUtils.CSRF_CLAIM_HEADER, res.headers.get(AppUtils.CSRF_CLAIM_HEADER));
                    localStorage.setItem(AppUtils.STORAGE_ACCOUNT_TOKEN, JSON.stringify(res.body));
                    localStorage.setItem(AppUtils.STORAGE_SECURITY_TOKEN, JSON.stringify(securityToken));

                    this.account = new Account(res);
                    this.account.authenticated = true;
                    this.sendLoginSuccess(this.account);

                    this.errorService.changeMessage('');
                    this.setAuth(res.body);
                    // this.router.navigate(['/home']);
                    this.router.navigateByUrl('/home');
                    // window.location.href = '/home';
                    // window.location.reload();
                    return this.account;
                })

            );


    }
	findUsersWithSortAndFilter(

		filter = '', sort: PaginationPropertySort,
		pageNumber = 0, pageSize = 3): Observable<any> {
		let apiUrl = this.createCompleteRoute('users', environment.api_url);
		const paramsx: any = { page: pageNumber, size: pageSize };
		if (sort != null) {
			paramsx.sort = sort.property + ',' + sort.direction;
		}
		// const sortTest = 'firstName' + '\&' + 'firstName.dir=desc';
		// const sortTestEncoded = encodeURIComponent(sortTest);
		let sortTest = sort.direction;
		if (sort.property !== '') {
			sortTest = sort.property + ',' + sort.direction;
		}
		let search: string;
		if (filter !== '') {
			apiUrl = this.createCompleteRoute('users/search', environment.api_url);

			let userName = '\'*' + filter + '*\'';
			let firstName = '\'*' + filter + '*\'';
			let lastName = '\'*' + filter + '*\'';

			//search = 'userName==' + filter + '* or ' + 'firstName==' + filter + '* or ' + 'lastName==' + filter + '*';
			search = 'userName==' + userName + ' or ' + 'firstName==' + firstName + ' or ' + 'lastName==' + lastName;

		}
		return this.http.get(apiUrl, {
			headers: new HttpHeaders(
				{
					//'apikey': application.apiKey, 
					'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
					'Access-Control-Allow-Origin': '*',
					'Authorization': 'Bearer ' + Cookie.get('access_token')
				}),
			params: new HttpParams()

				.set('search', search)
				.set('sort', sortTest)
				.set('page', pageNumber.toString())
				.set('size', pageSize.toString())

		}).pipe(
			map(res => res),
			catchError(error => {
				this.errorHandlerService.handleError(error);
				return throwError(error.statusText);
			})

		);
	}

	findActiveUsers(

		filter = '', sort: PaginationPropertySort,
		pageNumber = 0, pageSize = 3): Observable<any> {
		let apiUrl = this.createCompleteRoute('users/active', environment.api_url);
		const paramsx: any = { page: pageNumber, size: pageSize };
		if (sort != null) {
			paramsx.sort = sort.property + ',' + sort.direction;
		}
		// const sortTest = 'firstName' + '\&' + 'firstName.dir=desc';
		// const sortTestEncoded = encodeURIComponent(sortTest);
		let sortTest = sort.direction;
		if (sort.property !== '') {
			sortTest = sort.property + ',' + sort.direction;
		}
		let search: string;
		if (filter !== '') {
			apiUrl = this.createCompleteRoute('users/search', environment.api_url);

			search = 'userName==' + filter + '* or ' + 'firstName==' + filter + '* or ' + 'lastName==' + filter + '*';
		}
		return this.http.get(apiUrl, {
			headers: new HttpHeaders(
				{
					//'apikey': application.apiKey, 
					'Access-Control-Allow-Origin': '*',
					'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
				}),
			params: new HttpParams()

				.set('search', search)
				.set('sort', sortTest)
				.set('page', pageNumber.toString())
				.set('size', pageSize.toString())

		}).pipe(
			map(res => res),
			catchError(error => {
				this.errorHandlerService.handleError(error);
				return throwError(error.statusText);
			})

		);
	}

	changePassword(userName: string, password: string): Observable<User> {

		const headers = new HttpHeaders(
			{
				//'apikey': application.apiKey, 
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Credentials': 'true'
			}
		);

		const route = 'users/password';
		return this.http.post(this.createCompleteRoute(route, environment.api_url),
			JSON.stringify({ login: userName, password: password }), {
			headers: headers,
			observe: 'response'
		})

			.pipe(

				catchError((error: any) => {
					if (error.status === 401) {
						return throwError(
							'Unauthorized');
					} else {
						if (error.status === 403) {
							return throwError(
								'Unauthorized');
						} else {
							return throwError(
								'Unknown');
						}
					}
					// do any other checking for statuses here
				}),

				map((res: any) => {
					this.user = new User(res);
					return this.user;
				})

			);
	}

	getCurrentUser(): User {
		return this.currentUserSubject.value;
	}


	/*
		authenticate(userName: string, password: string): Observable<Account> {
	
			const headers = new HttpHeaders(
				{
					'apikey': application.apiKey, 					
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				}
			);
	
			// tslint:disable-next-line:max-line-length
			// return this.http.post(AppUtils.BACKEND_API_ROOT_URL + AppUtils.BACKEND_API_AUTHENTICATE_PATH, JSON.stringify({ login: userName, password: password }), {
			const route = 'authenticate';
			return this.http.post(this.createCompleteRoute(route, environment.api_url),
				JSON.stringify({ login: userName, password: password }), {
				headers: headers,
				observe: 'response'
			})
	
				// tslint:disable-next-line:max-line-length
				// return this.http.post(AppUtils.BACKEND_API_ROOT_URL + AppUtils.BACKEND_API_AUTHENTICATE_PATH, JSON.stringify({ login: userName, password: password }), {observe: 'response'})
				.pipe(
	
					catchError((error: any) => {
						if (error.status === 401) {
							// return Observable.throw('Unauthorized');
							this.errorService.changeMessage('Unauthorized request! Username/Password is invalid.');
							return throwError(
								'Unauthorized, Username / Password are invalid.');
						} else {
							if (error.status === 403) {
								// return Observable.throw('Unauthorized');
								this.errorService.changeMessage('Unauthorized request!');
								return throwError(
									'Unauthorized');
	
							} else {
								this.errorService.changeMessage(error.message);
								return throwError(
									'Unknown');
							}
						}
						// do any other checking for statuses here
					}),
	
	
					map((res: any) => {
	
	
						const securityToken: SecurityToken = new SecurityToken(
							{
								publicSecret: res.headers.get(AppUtils.HEADER_X_SECRET),
								securityLevel: res.headers.get(AppUtils.HEADER_WWW_AUTHENTICATE)
							}
						);
	
						localStorage.setItem(AppUtils.CSRF_CLAIM_HEADER, res.headers.get(AppUtils.CSRF_CLAIM_HEADER));
						localStorage.setItem(AppUtils.STORAGE_ACCOUNT_TOKEN, JSON.stringify(res.body));
						localStorage.setItem(AppUtils.STORAGE_ACCOUNT_TOKEN, JSON.stringify(securityToken));
	
						this.account = new Account(res);
						this.account.authenticated = true;
						this.sendLoginSuccess(this.account);
	
						this.errorService.changeMessage('');
						this.setAuth(res.body);
						// this.router.navigateByUrl('/home');
						return this.account;
					})
	
				);
		}
	*/
	sendLoginSuccess(account?: Account): void {
		if (!account) {
			account = new Account(JSON.parse(localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN)));
		}
		this.accountEventService.loginSuccess(account);
	}

	/*
		resetUser() {
	
			try {
				this.getUser()
	
					.subscribe(account => {
						this.account = account;
						this.account.authenticated = true;
					},
	
						(err) => this.error = err); // Reach here if fails;
	
			} catch (e) {
				this.logger.log(e);
			}
	
		}
	*/

	getUserViaSSO() {

		try {
			this.getUser()
				.subscribe(user => {
					this.user = user;
					this.setAuth(user);
					//const user = this.account.body.login;

					const userString =
						this.user.firstName
						+ " "
						+ this.user.lastName;

					const logMessage = 'UsersSpringService:'
						+ userString
						+ ' Successfully logged in.';

					//this.logger.log(logMessage);

					//this.account.authenticated = true;
					this.dataSharingService.isUserLoggedIn.next(true);
					if (this.isUserAuthorized(['ROLE_ADMIN'])) {
						this.dataSharingService.isUserAuthorized.next(true);
					}
				},

					(err) => this.error = err); // Reach here if fails;

		} catch (e) {
			this.logger.log(e);
		}
	}

	getUser(): Observable<User> {
		const headers = new HttpHeaders(
			{
				//'apikey': application.apiKey, 
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Credentials': 'true',
				'Authorization': 'Bearer ' + Cookie.get('access_token')

			}
		);
		const route = 'sso/getuser';
		return this.http.post(this.createCompleteRoute(route, environment.api_url), "dummy",
			{
				headers: headers,
				observe: 'response'
			})

			.pipe(

				catchError((error: any) => {
					if (error.status === 401) {
						this.errorService.changeMessage('Unauthorized request! Username/Password is invalid.');
						return throwError(
							'Unauthorized, Username / Password are invalid.');
					} else {
						if (error.status === 403) {
							this.errorService.changeMessage('Unauthorized request!');
							return throwError(
								'Unauthorized');

						} else {
							this.errorService.changeMessage(error.message);
							return throwError(
								'Unknown');
						}
					}
					// do any other checking for statuses here
				}),


				map((res: any) => {

					localStorage.setItem(AppUtils.STORAGE_ACCOUNT_TOKEN, JSON.stringify(res.body));

					this.account = new Account(res.body);
					this.account.authenticated = true;
					this.sendLoginSuccess(this.account);

					this.errorService.changeMessage('');
					this.setAuth(res.body);
					// this.router.navigateByUrl('/home');
					this.user = res.body;
					return this.user;
				})

			);
	}

	loginViaSSO() {

		//this.logger.log("UsersSpringService: loginViaSSO()");

		try {
			this.login()

				.subscribe(user => {

					this.account = new Account();

					//this.account = account as Account;

					const userString =
						this.user.firstName
						+ " "
						+ this.user.lastName;

					const logMessage = 'UsersSpringService:'
						+ userString
						+ ' Successfully logged in.';

					this.logger.log(logMessage);

					this.account.authenticated = true;
					this.dataSharingService.isUserLoggedIn.next(true);
					if (this.isUserAuthorized(['ROLE_ADMIN'])) {
						this.dataSharingService.isUserAuthorized.next(true);
					}
				},

					(err) => this.error = err); // Reach here if fails;

		} catch (e) {
			this.logger.log(e);
		}
	}

	public login(): Observable<User> {

		const headers = new HttpHeaders(
			{
				//'apikey': application.apiKey, 				
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Credentials': 'true',
				'Authorization': 'Bearer ' + Cookie.get('access_token')
			}
		);
		const route = 'sso/login';
		return this.http.post(this.createCompleteRoute(route, environment.api_url), "dummy",
			{
				headers: headers,
				observe: 'response'
			})

			.pipe(

				catchError((error: any) => {
					if (error.status === 401) {
						this.errorService.changeMessage('Unauthorized request! Username/Password is invalid.');
						return throwError(
							'Unauthorized, Username / Password are invalid.');
					} else {
						if (error.status === 403) {
							this.errorService.changeMessage('Unauthorized request!');
							return throwError(
								'Unauthorized');

						} else {
							this.errorService.changeMessage(error.message);
							return throwError(
								'Unknown');
						}
					}
					// do any other checking for statuses here
				}),


				map((res: any) => {

					localStorage.setItem(AppUtils.STORAGE_ACCOUNT_TOKEN, JSON.stringify(res.body));

					this.account = new Account(res.body);
					this.account.authenticated = true;
					this.sendLoginSuccess(this.account);

					this.errorService.changeMessage('');
					this.setAuth(res.body);
					// this.router.navigateByUrl('/home');
					this.user = res.body;
					return this.user;
				})

			);
	}

	logout(callServer: boolean = true): void {

		this.dataSharingService.isUserLoggedIn.next(false);

		const userString =
			this.user.firstName
			+ " "
			+ this.user.lastName;

		const logMessage = 'UsersSpringService:'
			+ userString
			+ ' Logged Out.';

		this.logger.log(logMessage);

		const headers = new HttpHeaders(
			{
				//'apikey': application.apiKey, 					
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Credentials': 'true'
				//				'Authorization': 'Bearer ' + Cookie.get('access_token')
			}
		);
		if (callServer) {
			const route = 'sso/logout';
			this.http.get(this.createCompleteRoute(route, environment.api_url), {
				headers: headers,
				observe: 'response'
			}).subscribe(() => {
				this.accountEventService.logout(new Account(JSON.parse(localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN))));
				this.removeAccount();
				this.purgeAuth();
				this.dataSharingService.isUserLoggedIn.next(false);
				this.dataSharingService.isUserAuthorized.next(false);
				this.dataSharingService.isActiveContactsReady.next(false);

				this.router.navigate(['/thank-you']);

				// window.location.reload();
				//                this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
				//                    this.router.navigate(['HeaderComponent']);
				//                });
			});
		} else {
			this.accountEventService.logout(new Account(JSON.parse(localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN))));
			this.removeAccount();
			this.purgeAuth();
			this.dataSharingService.isUserLoggedIn.next(false);
			this.dataSharingService.isUserAuthorized.next(false);
			this.dataSharingService.isActiveContactsReady.next(false);
		}
		//this.accountEventService.logout(new Account(JSON.parse(localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN))));
		//this.removeAccount();
		//this.purgeAuth();
		//this.dataSharingService.isUserLoggedIn.next(false);
		//this.dataSharingService.isUserAuthorized.next(false);
		//this.dataSharingService.isActiveContactsReady.next(false);
	}

	getUserId() {
		/*
				let token = Cookie.get('access_token')
		
				let tokenInfo = this.getDecodedAccessToken(token); // decode token
		
		
				const account: Account = new Account(JSON.parse(localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN)));
				return account.id;
		*/
		//let user = this.getUser();

		return +this.user.id

	}

	isUserAuthenticated(): boolean {

		const value = Cookie.get('access_token');

		if (value) {
			return true;
		}
		else {
			return false;
		}
	}

	isUserAuthorized(roles: Array<string>): boolean {

		let authorized = false;
		const authorities: Array<string> = [];

		if (!this.isUserAuthenticated()) {
			return false;
		}

		if (this.isUserAuthenticated() && roles) {
			const account: Account = new Account(JSON.parse(localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN)));
			if (account && account.authorities) {

				for (let i = 0; i < account.authorities.length; i++) {
					const obj: Authority = account.authorities[i];
					authorities.push(obj.authority);
				}

				account.authoritiesStringArray = authorities;
				roles.forEach((role: string) => {

					if (authorities.indexOf(role) !== -1) {
						authorized = true;
					}
				});
			}
		}
		return authorized;
	}
	/*
		// Verify JWT in localstorage with server & load user's info.
		// This runs once on application startup.
		populate() {
	
			// If JWT detected, attempt to get & store user's info
			if (this.jwtService.getToken()) {
				this.apiService.get('/user')
					.subscribe(
						//                   data => this.setAuth(data.user),
						data => this.setAuth(data),
						err => this.purgeAuth()
					);
			} else {
				// Remove any potential remnants of previous auth states
				this.purgeAuth();
			}
	
		}
	*/
	setAuth(user: User) {
		// Save JWT sent from server in localstorage
		// this.jwtService.saveToken(user.token);
		this.jwtService.saveToken(JSON.stringify(user));
		// Set current user data into observable
		this.currentUserSubject.next(user);
		// Set isAuthenticated to true
		this.isAuthenticatedSubject.next(true);
	}

	purgeAuth() {
		// Remove JWT from localstorage
		this.jwtService.destroyToken();
		Cookie.delete('access_token', '/');
		var cookie = Cookie.get('KC_REDIRECT');
		Cookie.delete('KC_REDIRECT', '/');

		//this.cookieService.delete('KC_REDIRECT');

		cookie = Cookie.get('OAuth_Token_Request_State');
		Cookie.delete('OAuth_Token_Request_State', '/');

		// Set current user to an empty object
		this.currentUserSubject.next({} as User);

		// Set auth status to false
		this.isAuthenticatedSubject.next(false);
	}

	removeAccount(): void {
		localStorage.removeItem(AppUtils.STORAGE_ACCOUNT_TOKEN);
	}

	private createCompleteRoute = (route: string, envAddress: string) => {
		return `${envAddress}/${route}`;
	}

	private generateHeaders() {
		return {

			headers: new HttpHeaders(
				{
					//'apikey': application.apiKey, 					
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					//					'Authorization': 'Bearer ' + Cookie.get('access_token')
				})
		};
	}

	getDecodedAccessToken(token: string): any {
		try {
			return jwt_decode(token);
		}
		catch (Error) {
			return null;
		}
	}

	// Verify JWT in localstorage with server & load user's info.
	// This runs once on application startup.
	populate() {

		// If JWT detected, attempt to get & store user's info
		if (this.jwtService.getToken()) {
			this.apiService.get('/user')
				.subscribe(
					//                   data => this.setAuth(data.user),
					data => this.setAuth(data),
					err => this.purgeAuth()
				);
		} else {
			// Remove any potential remnants of previous auth states
			this.purgeAuth();
		}

	}
}
