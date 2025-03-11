import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { asyncScheduler, of } from 'rxjs';
import { firebaseConfig } from 'src/environments/environment';

import { BooksService } from './books.service';

describe('BooksService', () => {
  let service: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports :[HttpClientTestingModule,
      AngularFireModule.initializeApp(firebaseConfig)]
    });
   service = TestBed.inject(BooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getSelectedBook and updateBooktoLibrary method', ()=> {
    let selectedBook =   {id: 1, title: 'The Great Gatsby'};
    let isbn = "isbn001";
   spyOn(service, 'getSelectedBook').and.returnValue(of({data: 'mocked data'}));
   spyOn(service, 'updateBooktoLibrary').and.returnValue(of({staus: 'sucess'}))
   service.getSelectedBook(isbn);
   service.updateBooktoLibrary("Lib1",isbn)
       expect(service.getSelectedBook).toHaveBeenCalledTimes(1);
       expect(service.updateBooktoLibrary).toHaveBeenCalledTimes(1);
 });



});
