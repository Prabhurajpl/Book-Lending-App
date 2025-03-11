import { BooksService } from './../../Core/services/books.service';
import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/Core/services/library.service';
import { BookDetails } from 'src/app/shared/interfaces/book-details';
import { UsersService } from 'src/app/Core/services/users.service';

@Component({
  selector: 'library-book-list',
  templateUrl: './library-book-list.component.html',
  styleUrls: ['./library-book-list.component.scss'],
})
export class LibraryBookListComponent implements OnInit {
  
  bookDataSource: any[] = [];
  filteredBooklist: any[] = [];
  searchTerm: string = '';
  existbooklist!: any;
  bookRequestedBy : string ="";

  constructor(
    private libraryservice: LibraryService,
    private bookservice:BooksService,
    private userdataservice:UsersService
  ) {}

  ngOnInit(): void {
    this.bookRequestedBy = this.userdataservice.userEmail;
    this.getAllBooks();
  }

  getAllBooks(){
    this.bookservice.getALLBooks().subscribe((data) => {
      this.bookDataSource = data;
      this.filteredBooklist = this.bookDataSource;
      this.existbooklist = this.filteredBooklist;
    });
  }
  searchBookList() {
    if (!this.searchTerm || this.searchTerm.length < 3) {
      this.filteredBooklist = this.existbooklist;
      return;
    }
    if (this.filteredBooklist) {
      this.filteredBooklist = this.filteredBooklist.filter((item) =>
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  requestBook(book: BookDetails) {
    if(book.book_addedBy === this.bookRequestedBy){
      alert("Owner can not request book")
      return
    }
     let bookId ;
     this.bookservice.getSelectedBook(book.isbn).subscribe({
       next: (resp:any) =>{
       bookId =resp.docs[0].id;
       this.bookservice.updateDocs(book.library,bookId,this.bookRequestedBy,book.book_addedBy)
       .then((resp)=>{
         alert("Request has been sent to " + book.book_addedBy)
       })
       },
      error:(err:any)=>{
          console.log("error",err.messages)
       }}
     )
  }
}
