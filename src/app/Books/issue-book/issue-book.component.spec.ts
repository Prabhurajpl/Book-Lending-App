import { BooksService } from 'src/app/Core/services/books.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from 'src/environments/environment';

import { IssueBookComponent } from './issue-book.component';
import { of } from 'rxjs';

describe('IssueBookComponent', () => {
  let component: IssueBookComponent;
  let fixture: ComponentFixture<IssueBookComponent>;
  let bookService : BooksService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueBookComponent ],
      imports :[HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    bookService = TestBed.inject(BooksService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call getSelectedBook and updateIssuedBookcollection when reqApprove is called', () => {
  //   let book ={ author_name: "J. K. Rowling", isbn: "1855494981",title: "Harry Potter and the Philosopher's Stone"}
  //   spyOn(bookService,'getSelectedBook').and.returnValue(of({}));
  //   spyOn(bookService, 'updateIssuedBookcollection').and.returnValue(of({}));
  //   component.reqApprove(book);

  //   expect(bookService.getSelectedBook).toHaveBeenCalled();
  //   expect(bookService.updateIssuedBookcollection).toHaveBeenCalled();
  // });
});
