import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Book } from '../core/interface/book.model';
import { BooksDataSource } from '../core/services/books.datasource';
import { BooksService } from '../core/services/books.service';
import { ErrorHandlerService } from '../../../base/core/services/error-handler.service';
import { Router } from '@angular/router';
import { BookDeleteDialogComponent } from './../book-delete/book-delete-dialog.component';

import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { fromEvent } from 'rxjs';
import { AngularLogService } from '../../../base/core/services/angular-log.service';

@Component({
	selector: 'app-book-list',
	templateUrl: './book-list.component.html',
	styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, AfterViewInit {

	public displayedColumns = ['title','author', 'details', 'update', 'delete'];
	dataSource: BooksDataSource;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	//@ViewChild('input', {static: false}) input: ElementRef;

	currentBook: Book;

	booksLength = 0;

	public searchString: string = '';

	sortProperty = '';

	private dialogConfig;

	deleteBookDialogRef: MatDialogRef<BookDeleteDialogComponent>;

	// tslint:disable-next-line:max-line-length
	constructor(private logger: AngularLogService, private repository: BooksService, private errorService: ErrorHandlerService, private router: Router, private dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef) { }
	ngOnInit() {

		this.dataSource = new BooksDataSource(this.repository);

		this.dataSource.loadBooks('', '', 'asc', 0, 6);

		this.dialogConfig = {
			height: '200px',
			width: '400px',
			disableClose: true,
			data: {}
		};
	}

	ngAfterViewInit(): void {

		this.sort.sortChange.subscribe((event) => {
			this.paginator.pageIndex = 0;
			this.sortProperty = event.active;
		});

		/*
				fromEvent(this.input.nativeElement, 'keyup')
					.pipe(
						debounceTime(150),
						distinctUntilChanged(),
						tap(() => {
							this.paginator.pageIndex = 0;
		
							this.loadBooksPage();
						})
					)
					.subscribe();
		*/

		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => this.loadBooksPage())
			)
			.subscribe(

				data => {
					console.log(data);
				}

			);

	}

	searchValueChanged() {

		this.paginator.pageIndex = 0;

		this.loadBooksPage();

	}

	searchFormSubmitted(type: string = 'All') {

		this.paginator.pageIndex = 0;

		this.loadBooksPage();

	}
	/*
		public getAllBooks = () => {
			this.repository.getData('book')
				.subscribe(res => {
					const data = res as PaginationPage<Book>;
					this.dataSource.data = data.content;
					this.changeDetectorRefs.detectChanges();
				},
					(error) => {
						this.errorService.handleError(error);
					});
		}
	*/
	public doFilter = (value: string) => {
		//        this.dataSource.filter = value.trim().toLocaleLowerCase();
	}

	public redirectToAdd = () => {
		const url = `books/book/create`;
		this.router.navigate([url]);
	}

	public redirectToDetails = (id: string) => {
		const url = `books/book/details/${id}`;
		this.router.navigate([url]);
	}

	public redirectToUpdate = (id: string) => {
		const url = `books/book/update/${id}`;
		this.router.navigate([url]);
	}

	public redirectToDelete = (id: string) => {
		this.dialogConfig.data = {
			id: id
		};
		const dialogRef = this.dialog.open(BookDeleteDialogComponent, this.dialogConfig)
			.afterClosed().subscribe(result => {
				this.loadBooksPage();
			});
	}

    public redirectToSend = (id: string) => {
        const url = `books/book/email/${id}`;
        this.router.navigate([url]);
    }
	
	loadBooksPage() {
		//this.input.nativeElement.value,
		this.dataSource.loadBooks(
			this.searchString,
			this.sortProperty,
			this.sort.direction,
			this.paginator.pageIndex,
			this.paginator.pageSize);

	}
}
