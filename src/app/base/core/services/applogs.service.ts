import { Injectable } from '@angular/core';
//import { AppService } from './app.service';
//import { Cookie } from 'ng2-cookies';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginationPage, PaginationPropertySort } from '../interface/pagination';
import { map, catchError } from 'rxjs/operators';
import { AppLog } from '../models/applog.model';
import { ErrorHandlerService } from './error-handler.service';
import { AngularLogService } from '../../core/services/angular-log.service';
import { application } from 'application';

@Injectable({
    providedIn: 'root'
})
export class AppLogsService {
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

    findLogs(

        filter = '', sortOrder = 'asc',
        pageNumber = 0, pageSize = 3): Observable<any> {
        const apiUrl = this.createCompleteRoute('log', environment.api_url);

        return this.http.get(apiUrl, {
			headers: new HttpHeaders(
				{
					'apikey': application.apiKey,    
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Access-Control-Allow-Credentials': 'true',
					'Access-Control-Allow-Origin': '*',
					//					'Authorization': 'Bearer ' + Cookie.get('access_token')
				}),

            params: new HttpParams()
                .set('filter', filter)
                .set('sort', sortOrder)
                .set('page', pageNumber.toString())
                .set('size', pageSize.toString())
        }).pipe(
            // map(res => res['content']
            map(res => res
            )
        );
    }

    findLogsWithSort(

        filter = '', sort: PaginationPropertySort,
        pageNumber = 0, pageSize = 3): Observable<any> {
        const apiUrl = this.createCompleteRoute('log', environment.api_url);
        const paramsx: any = { page: pageNumber, size: pageSize };
        if (sort != null) {
            paramsx.sort = sort.property + ',' + sort.direction;
        }

        let sortTest = sort.direction;
        if (sort.property !== '') {
            sortTest = sort.property + ',' + sort.direction;
        }
        return this.http.get(apiUrl, {
			headers: new HttpHeaders(
				{
					'apikey': application.apiKey,    
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Access-Control-Allow-Credentials': 'true',
					'Access-Control-Allow-Origin': '*',
					//					'Authorization': 'Bearer ' + Cookie.get('access_token')
				}),
            params: new HttpParams()

                .set('search', filter)

                .set('sort', sortTest)

                .set('page', pageNumber.toString())

                .set('size', pageSize.toString())

        }).pipe(
            // map(res => res['content']
            map(res => res
            )
        );
    }

    findLogsWithSortAndFilter(

        filter = '', sort: PaginationPropertySort,
        pageNumber = 0, pageSize = 3): Observable<any> {
        let apiUrl = this.createCompleteRoute('app/log', environment.api_url);
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
            apiUrl = this.createCompleteRoute('app/log/search', environment.api_url);
            // search = 'status==' + filter + '* or ' + 'firstLine==' + filter + '* or ' + 'ip==' + filter + '* or ' + 'recieveTime==' + filter + '* or ' + 'path==' + filter + '*';
            search =  
           'message==' + '\'*' + filter + '*\'';
//            + ' or ' + 'level==' + '\'*' + filter + '*\'';

        }

        return this.http.get(apiUrl, {
			headers: new HttpHeaders(
				{
					'apikey': application.apiKey,    
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Access-Control-Allow-Credentials': 'true',
					'Access-Control-Allow-Origin': '*',
					//					'Authorization': 'Bearer ' + Cookie.get('access_token')
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

    private createCompleteRoute = (route: string, envAddress: string) => {
        return `${envAddress}/${route}`;
    }

    private generateHeaders() {
        return {

			headers: new HttpHeaders(
				{
					'apikey': application.apiKey,    
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Access-Control-Allow-Credentials': 'true',
					'Access-Control-Allow-Origin': '*',
					//					'Authorization': 'Bearer ' + Cookie.get('access_token')
				})
        };
    }
}

