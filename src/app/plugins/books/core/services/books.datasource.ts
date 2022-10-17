
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Book } from '../interface/book.model';
import { BooksService } from './books.service';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationPage, PaginationPropertySort } from '../interface/pagination';
import { AngularLogService } from '../../../../base/core/services/angular-log.service';

export class BooksDataSource implements DataSource<Book> {

	private booksSubject = new BehaviorSubject<Book[]>([]);

	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	public paginationPage: Object;

	public total = 0;

	constructor(private booksService: BooksService) {

	}

	loadBooks(
		filter: string,
		sortProperty: string,
		sortDirection: string,
		pageIndex: number,
		pageSize: number) {

		this.loadingSubject.next(true);

		const sort = new PaginationPropertySort();
		sort.property = sortProperty;
		sort.direction = sortDirection;

		this.booksService.findBooksWithSortAndFilter(filter, sort,
			pageIndex, pageSize).pipe(
				catchError(() => of([])),
				finalize(() => this.loadingSubject.next(false))
			)
			.subscribe(response => {
				//console.log("response:" + response);
				this.booksSubject.next(response.content);
				this.total = response.totalElements;
			}
			);
	}

	connect(collectionViewer: CollectionViewer): Observable<Book[]> {
		//console.log('Connecting data source');
		return this.booksSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.booksSubject.complete();
		this.loadingSubject.complete();
	}

}

