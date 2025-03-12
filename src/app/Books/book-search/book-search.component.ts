import { UsersService } from 'src/app/Core/services/users.service';
import { BookDetails } from './../../shared/interfaces/book-details';
import { BooksService } from './../../Core/services/books.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LibraryService } from 'src/app/Core/services/library.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collectionGroup } from '@angular/fire/firestore';

@Component({
  selector: 'book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit,OnDestroy {
  searchTerm: string = '';
  selectedBookdetails!: Array<BookDetails>;
  bookDataSource!: any;
  allBooksList!: any;
  isLoading = false;
  postperPage = pagedetails.postperpage;
  curentpage = pagedetails.curentpage;
  totalPosts!: number;
  islistlib = false;
  allLibrary!: any;
  selectedbook!: string;
  selectedLib!: string;
  bookcollection!: any;
  booklist!: any;
  bookArray: any[] = [];
  subs$! : Subscription;
  constructor(
    private bookservice: BooksService,
    private libservice: LibraryService,
    private userservice: UsersService,
    public afsdb: AngularFirestore,
  ) {}
  ngOnInit(): void {
    this.subs$ = this.bookservice.getIssuedBooks(this.userservice.userEmail).subscribe((resp) =>{
              this.userservice.changeCountofBook(resp.length)
        })
   }

  search() {
    this.isLoading = true;
    this.bookservice.getBooks(this.searchTerm).subscribe({
      next: (response) => {
        this.allBooksList = response.docs;
        this.totalPosts = this.allBooksList.length;
        this.setPagination(this.curentpage);
      },
      error:(err) => {
        console.log(customErrormesages.bookSearchuURL + err.messages);
      },
      complete:() => {
        this.isLoading = false;
      },
  });
  }

  setPagination(selectedpage: number) {
    let indexofLastpage = selectedpage * pagedetails.postperpage;
    let indexofFirstpage = indexofLastpage - pagedetails.postperpage;
    this.bookDataSource = this.allBooksList?.slice(
      indexofFirstpage,
      indexofLastpage
    );
  }

  addBooktoLibrary(selectedbook: any) {
    this.getliblist(selectedbook);
  }

  getliblist(selectedbook: any) {
    this.libservice.getLibcollections().subscribe({
      next: (response) => {
        this.allLibrary = response;
        this.islistlib = true;
        this.selectedBookdetails = [];
        this.selectedBookdetails.push({
          title: selectedbook?.title,
          publish_date: selectedbook?.publish_date[0],
          author_name: selectedbook?.author_name[0],
          isbn: selectedbook.isbn[0],
          status: 'Available',
          book_addedBy: this.userservice.userEmail,
        });
      },
      error: (err) => {
        console.log(customErrormesages.getLibraryCollection + err.messages);
      },
    });
  }

  closepopup() {
    console.log(this.islistlib)
    this.islistlib = false;
  }
  saveBooktoLib() {
    this.selectedBookdetails?.forEach((element) => {
      element.library = this.selectedLib;
    });
    this.bookservice.addBook(this.selectedLib, this.selectedBookdetails[0])
      .subscribe({
        next:(resp: any) => {
        window.alert('Books added to : ' + this.selectedLib);
        this.selectedLib = '';
        this.islistlib = false;
        },
        error: (err) =>{
          console.log(customErrormesages.addBooktoLibrary + err.messages);
        }
      });
  }
  
  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }
}

const enum pagedetails {
  postperpage = 12,
  curentpage = 1,
}

const enum customErrormesages {
  bookSearchuURL = 'error occure at book search',
  getLibraryCollection = 'erorr occured try to fetch libcollection',
  addBooktoLibrary ="error occured in add book to library",
}
