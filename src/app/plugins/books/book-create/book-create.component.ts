import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { BooksService } from '../core/services/books.service';
import { Book } from '../core/interface/book.model';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../base/shared/dialogs/success-dialog/success-dialog.component';
import { ErrorHandlerService } from '../../../base/core/services/error-handler.service';
import { AngularLogService } from '../../../base/core/services/angular-log.service';

@Component({
	selector: 'app-book-create',
	templateUrl: './book-create.component.html',
	styleUrls: ['./book-create.component.scss']
})
export class BookCreateComponent implements OnInit {
	public bookForm: UntypedFormGroup;
	private dialogConfig;

	// tslint:disable-next-line:max-line-length
	constructor(private logger: AngularLogService, private location: Location, private repository: BooksService, private dialog: MatDialog, private errorService: ErrorHandlerService) { }

	ngOnInit() {
		this.bookForm = new UntypedFormGroup({		
			id: new UntypedFormControl(''),
			title: new UntypedFormControl(''),
			author: new UntypedFormControl(''),
			category: new UntypedFormControl(''),
		});

		this.dialogConfig = {
			height: '200px',
			width: '400px',
			disableClose: true,
			data: {}
		};
	}

	public hasError = (controlName: string, errorName: string) => {
		return this.bookForm.controls[controlName].hasError(errorName);
	}

	public onCancel = () => {
		this.location.back();
	}

	public createBook = (bookFormValue) => {
		if (this.bookForm.valid) {
			this.executeBookCreation(bookFormValue);
		}
	}

	private executeBookCreation = (bookFormValue) => {
		const book: Book = {

			id: '',
			title: bookFormValue.title,
			author: bookFormValue.author,
			category: bookFormValue.category,
		};

		const apiUrl = 'books';
		this.repository.create(apiUrl, book)
			.subscribe(res => {
				const dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);

				// we are subscribing on the [mat-dialog-close] attribute as soon as we click on the dialog button
				dialogRef.afterClosed()
					.subscribe(result => {
						this.location.back();
					});
			},
				(error => {
					this.errorService.dialogConfig = { ...this.dialogConfig };
					this.errorService.handleError(error);
				})
			);
	}

}
