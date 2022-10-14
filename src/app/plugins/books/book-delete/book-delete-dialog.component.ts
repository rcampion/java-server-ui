import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { BooksService } from '../core/services/books.service';
import { ErrorHandlerService } from '../../../base/core/services/error-handler.service';
import { AngularLogService } from '../../../base/core/services/angular-log.service';

@Component({
    selector: 'app-book-delete-dialog',
    templateUrl: './book-delete-dialog.component.html',
    styleUrls: ['./book-delete-dialog.component.scss']
})
export class BookDeleteDialogComponent implements OnInit {
    id: string;
    constructor(private logger: AngularLogService,
        private repository: BooksService,

        private errorHandler: ErrorHandlerService,

        private dialogRef: MatDialogRef<BookDeleteDialogComponent>,

        private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data) {

        this.id = data.id;
    }

    ngOnInit() {
    }
    public delete() {
        const apiUrl = `books/${this.id}`;
        this.repository.delete(apiUrl)
            .subscribe(res => {
                this.id = res as string;
            },
                (error) => {
                    this.errorHandler.handleError(error);
                });
        this.dialogRef.close();

    }

}
