import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map, Observable, of, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
 
  filteredBooklist!:any;
  errorMessage :string ="";
  constructor(private http: HttpClient,private db: AngularFirestore) {   }
  
  getBooks(searchTerm:string): Observable<any> {
    return this.http.get(`http://openlibrary.org/search.json?q=${searchTerm}`)
    .pipe(
      retry(1),
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    )
  }

  addBook(libraryname:string,selectedbook:any) : Observable<any>{
    const Bookref = this.db.collection('Books-Group');
    let Book:any = Bookref.doc(libraryname).collection('Books').doc().set(selectedbook)
    return of(Book);
  }

  getALLBooks() : Observable<any> {
    return this.db.collectionGroup('Books')
    .snapshotChanges().pipe(
      map((libcollection: any[]) =>
      libcollection.map((item) => ({
          id: item.payload.doc.id,
          ...item.payload.doc.data(),
        }))
      ),
      catchError(this.handleError)
    )
  }

  getMyBooks(logineduser:string):Observable<any> {
    return this.db.collectionGroup('Books', ref => ref.where('book_requestedby', '==', logineduser))
    .snapshotChanges()
    .pipe(
     map((libcollection: any[]) =>
      libcollection.map((item) => ({
          id: item.payload.doc.id,
          ...item.payload.doc.data(),
        }))
      ),
      catchError(this.handleError)
    )
  }

  getIssuedBooks(logineduser:string):Observable<any> {
    return this.db.collectionGroup('Books', ref => ref.where('book_issuedby', '==', logineduser))
    .snapshotChanges()
    .pipe(
     map((libcollection: any[]) =>
      libcollection.map((item) => ({
          id: item.payload.doc.id,
          ...item.payload.doc.data(),
        })) 
      ),
      catchError(this.handleError)
    )
  }

  getSelectedBook(bookIsbn:string,) :any  {
    return this.db.collectionGroup('Books', ref => ref.where('isbn', '==', bookIsbn)).get()
   }

   updateDocs(selectedLibrary:any,bookid:string,bookRequestedBy?:string,bookOwner?:string) {
        return  this.db.doc(`Books-Group/${selectedLibrary}/Books/${bookid}`).update({
            is_requested: "true",
            status:"Requested",
            book_requestedby :bookRequestedBy,
            book_issuedby :bookOwner,
          })
    }

    updateIssuedBookcollection(selectedLibrary:any,bookid:string) :any{
      return  this.db.doc(`Books-Group/${selectedLibrary}/Books/${bookid}`).update({
        is_issuedbook: "issued",
        status:"Not Available",
        is_approved:"true"
      })
    }
   
    rejectBooksrequest(selectedLibrary:any,bookid:string){
      return  this.db.doc(`Books-Group/${selectedLibrary}/Books/${bookid}`).update({
        is_issuedbook: "rejected",
        status:"Available",
        is_approved:"false",
        book_issuedby:""
      })
    }
    
    requestBacktoBook(selectedLibrary:any,bookid:string){
      return  this.db.doc(`Books-Group/${selectedLibrary}/Books/${bookid}`).update({
        is_issuedbook: "requestback"
      })
    }
    
    updateBooktoLibrary(selectedLibrary:any,bookid:string) :any {
      return  this.db.doc(`Books-Group/${selectedLibrary}/Books/${bookid}`).update({
        is_issuedbook: "",
        is_requested: "false",
        status:"Available",
        book_requestedby :"",
        book_issuedby :"",
      })
    }
    
    getLoginedUserDetails(email:string) :Observable<any>{
      return this.db.collection('Users', ref => ref.where('email', '==', email)).snapshotChanges()
      .pipe(
       map((libcollection: any[]) =>
        libcollection.map((item) => ({
            id: item.payload.doc.id,
            ...item.payload.doc.data(),
          })) 
        ),
        catchError(this.handleError)
      )
    }

    handleError(error:any) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(() => {
          return errorMessage;
      });
    }
  
}
