import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BookListComponent } from '../book-list/book-list.component';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { BookCreateComponent } from '../book-create/book-create.component';
import { BookUpdateComponent } from '../book-update/book-update.component';
//import { BookEMailComponent } from '../book-email/book-email.component';

const routes: Routes = [
    { path: '', component: BookListComponent },
    { path: 'list', component: BookListComponent },
    { path: 'book/details/:id', component: BookDetailsComponent },
    { path: 'book/create', component: BookCreateComponent },
    { path: 'book/update/:id', component: BookUpdateComponent },
//    { path: 'book/email/:id', component: BookEMailComponent },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class BookRoutingModule { }
