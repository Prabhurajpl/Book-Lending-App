import { Firestore} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, Subject, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private itemsCollection!: AngularFirestoreCollection<any>;

  liblist!: Observable<any>;
  item$!:Observable<any>
  libCollections :any;
  libraryView = new Subject<any>();
  collection$ = new Subject<any>();
  errorMessage:string ="";
  constructor(private db: AngularFirestore, private firestore: Firestore) {
    this.itemsCollection = db.collection<any>('Library');
    this.liblist = this.itemsCollection.snapshotChanges();
  }

  addLibrary(item: any):any{
   return  this.itemsCollection.add(item);
  } 

  getLibraryBooks(selectedLibrary:string) :Observable<any>{
    return this.db.collectionGroup('Books', ref => ref.where('library', '==', selectedLibrary))
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
  
  getLibcollections():Observable<any>{
    return this.liblist.pipe(map((libcollection: any[]) =>
      libcollection.map((item) => ({
          id: item.payload.doc.id,
          ...item.payload.doc.data(),
        }))
      ),
      catchError(this.handleError)
    )
  }
  getbooksexistinlibrary(selectedLibrary:string) : Observable<any>{
    return this.db.collectionGroup('Books', ref => ref.where('library', '==', selectedLibrary)).get()
    
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
