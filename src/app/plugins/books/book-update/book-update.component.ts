import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Book } from '../core/interface/book.model';
import { BooksService } from '../core/services/books.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../base/shared/dialogs/success-dialog/success-dialog.component';
import { ErrorHandlerService } from '../../../base/core/services/error-handler.service';
import { AngularLogService } from '../../../base/core/services/angular-log.service';

@Component({
    selector: 'app-book-update',
    templateUrl: './book-update.component.html',
    styleUrls: ['./book-update.component.css']
})
export class BookUpdateComponent implements OnInit {
    public book: Book;
    public bookForm: UntypedFormGroup;

    private dialogConfig;

    // tslint:disable-next-line:max-line-length
    constructor(private logger: AngularLogService,private location: Location, private repository: BooksService, private dialog: MatDialog,
        router: Router,
        private activeRoute: ActivatedRoute, private errorService: ErrorHandlerService) { }


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

        this.getBookDetails();


    }
    private getBookDetails = () => {
        const id: string = this.activeRoute.snapshot.params['id'];
        const apiUrl = `books/${id}`;

        this.repository.getData(apiUrl)
            .subscribe(res => {
                this.book = res as Book;
                this.populateForm();
            },
                (error) => {
                    this.errorService.handleError(error);
                });
    }

    private populateForm() {
			this.bookForm.controls['id'].setValue(this.book.id);
			this.bookForm.controls['title'].setValue(this.book.title);
			this.bookForm.controls['author'].setValue(this.book.author);
			this.bookForm.controls['category'].setValue(this.book.category);

    }

    public updateBook = (bookFormValue) => {
        if (this.bookForm.valid) {
            this.executeBookUpdate(bookFormValue);
        }
    }

    private executeBookUpdate = (bookFormValue) => {
        const book: Book = {
			id: bookFormValue.id,
			title: bookFormValue.title,
			author: bookFormValue.author,
			category: bookFormValue.category,

         };

        const apiUrl = 'books';
        this.repository.update(apiUrl, book)
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

    public hasError = (controlName: string, errorName: string) => {
        return this.bookForm.controls[controlName].hasError(errorName);
    }

    public onCancel = () => {
        this.location.back();
    }

}
