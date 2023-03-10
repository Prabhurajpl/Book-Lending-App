import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/Core/services/books.service';
import { LibraryService } from 'src/app/Core/services/library.service';
import { UsersService } from 'src/app/Core/services/users.service';

@Component({
  selector: 'app-issue-book',
  templateUrl: './issue-book.component.html',
  styleUrls: ['./issue-book.component.scss']
})
export class IssueBookComponent implements OnInit {

  libdatsource!: any;
  issuedBooklist!: any;
  exisitingReqBookcol!: Array<any>;
  userEmail!: any;
  bookDataSource!: string[];
  bookArray: any[] = [];
  constructor(
    private libservice: LibraryService,
    private bookservice: BooksService,
    private userDataservice: UsersService
  ) { }

  ngOnInit(): void {
    const userId = this.userDataservice.userEmail;
    this.bookservice.getIssuedBooks(userId).subscribe(resp =>{
        this.issuedBooklist =resp;
    })
  }

  reqApprove(book: any) {
    let btn_Accept = <HTMLElement>document.getElementById(book.isbn);
    let bookId;
    if (btn_Accept.innerText === 'Approve') {
      this.bookservice.getSelectedBook(book.isbn).subscribe({
      next: (resp)=>{
              bookId =resp.docs[0].id;
              this.bookservice.updateIssuedBookcollection(book.library,bookId) .then((resp)=>{
               btn_Accept.innerText = 'Request Back';
              alert("Request has been updated") 
              }).catch((err)=>{
                console.log("error", err.messages)
              })
      },
      error :(err)=>{
         console.log("error", err.messages)
      }})
    }else{
      this.bookservice.getSelectedBook(book.isbn).subscribe((resp)=>{
        bookId =resp.docs[0].id;
        this.bookservice.requestBacktoBook(book.library,bookId)
        .then((resp)=>{
          btn_Accept.innerText = 'Request Back';
          alert("Request has been sent to :" + book.book_requestedby )
        })
        })
    }

  }

  rejectbookreq(book:any){
    let bookId;
    this.bookservice.getSelectedBook(book.isbn).subscribe({
      next:(resp)=>{
      bookId =resp.docs[0].id;
      this.bookservice.rejectBooksrequest(book.library,bookId)
      .then((resp)=>{
         alert(("Book list updated.."))
      })
      },
      error:(err)=>{
        console.log("error",err.messages)
      }})
  }


}
