import { Component, OnInit } from '@angular/core';

import { Book } from '../core/interface/book.model';
import { Router, ActivatedRoute } from '@angular/router';
import { BooksService } from '../core/services/books.service';

import { ErrorHandlerService } from '../../../base/core/services/error-handler.service';

import { AngularLogService } from '../../../base/core/services/angular-log.service';

@Component({
	selector: 'app-book-details',
	templateUrl: './book-details.component.html',
	styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
	public book: Book;
	public showAccounts;

	constructor(private logger: AngularLogService,
		private repository: BooksService,
		private router: Router,
		private activeRoute: ActivatedRoute,
		private errorHandler: ErrorHandlerService) { }

	ngOnInit() {
		this.getBookDetails();
	}

	private getBookDetails = () => {
		const id: string = this.activeRoute.snapshot.params['id'];
		const apiUrl = `books/${id}`;

		this.repository.getData(apiUrl)
			.subscribe(res => {
				this.book = res as Book;
			},
				(error) => {
					this.errorHandler.handleError(error);
				});
	}
}
