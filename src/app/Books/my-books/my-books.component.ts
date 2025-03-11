import { UsersService } from './../../Core/services/users.service';
import { BooksService } from './../../Core/services/books.service';
import { LibraryService } from './../../Core/services/library.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
})
export class MyBooksComponent implements OnInit {
  
  myBooklist!: any;

  constructor(
    private libservice: LibraryService,
    private bookservice: BooksService,
    private userDataservice: UsersService
  ) {}

  ngOnInit(): void {
    const userId = this.userDataservice.userEmail;
    if(userId != undefined)
    this.bookservice.getMyBooks(userId).subscribe((resp)=>{
         this.myBooklist = resp;
    })
  }  
  returnBooktoLibraray(book:any){
    let bookId ;
    this.bookservice.getSelectedBook(book.isbn).subscribe((resp:any)=>{
      bookId =resp.docs[0].id;
      this.bookservice.updateBooktoLibrary(book.library,bookId)
      .then((resp:any)=>{   
         alert ("Book has been sent to library")
      })
      })
  }
   
}
