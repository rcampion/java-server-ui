import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PaginationPage, PaginationPropertySort } from '../interface/pagination';
import { map , catchError } from 'rxjs/operators';

import { ErrorHandlerService } from '../../../../base/core/services/error-handler.service';
import { AngularLogService } from '../../../../base/core/services/angular-log.service';

//import { application } from 'application';

@Injectable({
    providedIn: 'root'
})
export class BooksService {

    constructor(private http: HttpClient,
        private errorService: ErrorHandlerService) { }

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

    private createCompleteRoute = (route: string, envAddress: string) => {
        return `${envAddress}/${route}`;
    }

    findBooksWithSortAndFilter(

        filter = '', sort: PaginationPropertySort,
        pageNumber = 0, pageSize = 3): Observable<any> {
        let apiUrl = this.createCompleteRoute('books', environment.api_url);
        const paramsx: any = { page: pageNumber, size: pageSize };
        if (sort != null) {
            paramsx.sort = sort.property + ',' + sort.direction;
        }

        let sortTest = sort.direction;
        if (sort.property !== '') {
            sortTest = sort.property + ',' + sort.direction;
        }

        let search: string;
        if (filter !== '') {
            apiUrl = this.createCompleteRoute('books/search', environment.api_url);
			
			let title = '\'*' + filter + '*\'';
			let author = '\'*' + filter + '*\'';

            //search = 'bookName==*' + filter + '* or ' + 'bookDescription==*' + filter + '*';
            //search = 'bookDescription==' + filter + '*';
            search = 'title==' + title + ' or ' + 'author==' + author;

        }
        return this.http.get(apiUrl, {
            headers: new HttpHeaders(
                {
				'apiKey': '001',
                'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                //'Access-Control-Allow-Origin': 'http://localhost:8089',
//                'Authorization': 'Bearer ' + Cookie.get('access_token')
            }),
            params: new HttpParams()

                .set('search', search)

                .set('sort', sortTest)

                .set('page', pageNumber.toString())
                .set('size', pageSize.toString())

        }).pipe(
            // map(res => res['content']
            map(res => res),
            catchError(error => { this.errorService.handleError(error); return throwError(error.statusText); })
        );
    }

    findBookMembersWithSortAndFilter(
        bookId = 0,
        filter = '', sort: PaginationPropertySort,
        pageNumber = 0, pageSize = 3): Observable<any> {

        const id: number = bookId;
        const buildApiUrl = 'book/member/' + id;
        let apiUrl = this.createCompleteRoute(buildApiUrl, environment.api_url);
        const paramsx: any = { page: pageNumber, size: pageSize };
        if (sort != null) {
            paramsx.sort = sort.property + ',' + sort.direction;
        }

        let sortTest = sort.direction;
        if (sort.property !== '') {
            sortTest = sort.property + ',' + sort.direction;
        }
        let search: string;
        if (filter !== '') {
            apiUrl = this.createCompleteRoute('contact/search', environment.api_url);
			
			let fullName = '\'*' + filter + '*\'';
			let firstName = '\'*' + filter + '*\'';
			let lastName = '\'*' + filter + '*\'';
			let company = '\'*' + filter + '*\'';
			let title = '\'*' + filter + '*\'';

			search = 'fullName==' + fullName + ' or ' + 'firstName==' + firstName + ' or ' + 'lastName==' + lastName + ' or ' + 'company==' + company+ ' or ' + 'title==' + title;
        }
        return this.http.get(apiUrl, {
            headers: new HttpHeaders(
                {
				'apiKey': '001',
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
            // map(res => res['content']
            map(res => res),
            catchError(error => { this.errorService.handleError(error); return throwError(error.statusText); })
        );
    }

	private generateHeaders() {
		
		const headers = new HttpHeaders(
			{					
				'apiKey': '001', 
//				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
//				'Access-Control-Allow-Credentials': 'true',
//				'Authorization': 'Bearer ' + Cookie.get('access_token')

			}
		);
		
		return {

			headers: headers
			
		};
	}
}
