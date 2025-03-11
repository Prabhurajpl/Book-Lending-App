import { UsersService } from 'src/app/Core/services/users.service';
import { BookDetails } from './../../shared/interfaces/book-details';
import { BooksService } from './../../Core/services/books.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { LibraryService } from 'src/app/Core/services/library.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
  librarySubscr !:Subscription;
  bookHasExistInLibrary =false;
  userId : string ="";
  constructor(
    private bookservice: BooksService,
    private libservice: LibraryService,
    private userservice: UsersService,
    public afsdb: AngularFirestore,
  ) {}
  ngOnInit(): void {
    this.getIssuedBooksCount();
   }

   getIssuedBooksCount(){
    if(this.userservice.userEmail != undefined)
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
   this.userId = this.userservice.userEmail;
   this.librarySubscr =  this.libservice.getLibcollections().subscribe({
     next :(response) => {
        this.allLibrary = response?.filter((item:any) => {return item.added_by === this.userId});
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
    this.selectedLib ="";
    this.islistlib = false;
    if(this.librarySubscr)
    this.librarySubscr.unsubscribe();

  }
  saveBooktoLib() {
    if(this.selectedLib === ""){
      alert("select a library")
      return
    }
    this.libservice.getbooksexistinlibrary(this.selectedLib).subscribe((respData)=>{
      let existbook:any [] =[];
      respData.docs.forEach((doc :any) => {
        existbook.push(doc.data());
      });
      this.bookHasExistInLibrary = existbook.some((item :any) => { return item.isbn === this.selectedBookdetails[0].isbn})
      if(!this.bookHasExistInLibrary){
        this.selectedBookdetails?.forEach((element) => {element.library = this.selectedLib });
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
        else{
          alert("selected book already exists in this library")
        }
    })
   

  }

  ngOnDestroy(): void {
    if(this.subs$)
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
