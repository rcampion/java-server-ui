import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../base/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BookListComponent } from './book-list/book-list.component';
import { BookRoutingModule } from './book-routing/book-routing.module';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookDataComponent } from './book-details/book-data/book-data.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../base/shared';
import { BookUpdateComponent } from './book-update/book-update.component';
import { BookDeleteDialogComponent } from './book-delete/book-delete-dialog.component';
//import { BookMemberListComponent } from './book-details/book-member/book-member-list/book-member-list.component';
// tslint:disable-next-line:max-line-length
//import { BookMemberSelectionDialogComponent } from './book-details/book-member/book-member-selection-dialog/book-member-selection-dialog.component';
// tslint:disable-next-line:max-line-length
//import { BookMemberSelectionListComponent } from './book-details/book-member/book-member-selection-list/book-member-selection-list.component';
//import { BookEMailComponent } from './book-email/book-email.component'

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// import needed PrimeNG modules here
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';

import { NgxMatFileInputModule } from '@angular-material-components/file-input';

import { RecaptchaModule } from 'ng-recaptcha';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
	imports: [
		CommonModule,
		BookRoutingModule,
		ReactiveFormsModule,
		SharedModule,
		
		MaterialModule,
		MatDialogModule,
		MatInputModule,
		MatFormFieldModule,
		
		FontAwesomeModule,
		ButtonModule,
		InputTextModule,
		PanelModule,
		NgxMatFileInputModule,
		RecaptchaModule,
		CKEditorModule,
	],
	// tslint:disable-next-line:max-line-length
	declarations: [
		BookListComponent,
		BookDetailsComponent,
		BookDataComponent,
		BookCreateComponent,
		BookUpdateComponent,
		BookDeleteDialogComponent,
		//BookMemberListComponent,
		//BookMemberSelectionDialogComponent,
		//BookMemberSelectionListComponent,
		//BookEMailComponent
	]
})
export class BooksModule {


	constructor(library: FaIconLibrary) {

		library.addIcons(faSearch);

	}
}
