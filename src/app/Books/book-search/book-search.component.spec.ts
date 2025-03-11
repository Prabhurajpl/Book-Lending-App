import { BookDetails } from './../../shared/interfaces/book-details';
import { LibraryService } from 'src/app/Core/services/library.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BooksService } from 'src/app/Core/services/books.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookSearchComponent } from './book-search.component';
import { AngularFireModule } from '@angular/fire/compat';
import { firebaseConfig } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {  of } from 'rxjs';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let bookService: BooksService;
  let libService: LibraryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig),
      ],
      declarations: [BookSearchComponent],
      providers: [BooksService, LibraryService],
    }).compileComponents();

    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    bookService = TestBed.get(BooksService);
    libService = TestBed.get(LibraryService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getIssuedBooks method on init', () => {
    const userEmail = 'test@gmail.com';
    let mockresponsofbooks = new Array();
    const service = fixture.debugElement.injector.get(BooksService);
    spyOn(service, 'getIssuedBooks')
      .withArgs(userEmail)
      .and.returnValue(of(mockresponsofbooks));
    component.getIssuedBooksCount();
    expect(mockresponsofbooks).toEqual([]);
  });

  it('should add a book ', () => {
    let selectedBookdetails: BookDetails = {
      title: 'BookTitle',
      publish_date: new Date(),
      author_name: 'mark villiam',
      isbn: 'ISB0123',
      status: 'Available',
      book_addedBy: 'Prabhuraj',
    };
    let fakeResponse = {
      status: 'sucess',
      statuscode: 201,
    };
    let selectedLib = 'lib1';
    const bookService = fixture.debugElement.injector.get(BooksService);
    const libService = fixture.debugElement.injector.get(LibraryService);
    spyOn(libService, 'getbooksexistinlibrary').and.returnValue(of(fakeResponse));
    libService.getbooksexistinlibrary(selectedLib);
    expect(libService.getbooksexistinlibrary).toHaveBeenCalledWith(selectedLib);
    spyOn(bookService, 'addBook').and.returnValue(of(fakeResponse));
    bookService.addBook(selectedLib, selectedBookdetails);
    expect(bookService.addBook).toHaveBeenCalledWith(selectedLib,selectedBookdetails);
  });

  it('should search for a book', () => {
    const books = [
      { title: 'Moby Dick', author: 'Herman Melville' },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    ];
    const searchTerm = 'Moby';
    const expectedBooks = [{ title: 'Moby Dick', author: 'Herman Melville' }];
    spyOn(bookService, 'getBooks').and.returnValue(
      of(books.filter((book) => book.title.includes(searchTerm)))
    );
    bookService.getBooks(searchTerm).subscribe((data) => {
      expect(data).toEqual(expectedBooks);
    });
  });

  it('should close the popup when the closePopup method is called', () => {
    component.islistlib = true;
    component.closepopup();
    expect(component.islistlib).toBe(false);
  });



});
