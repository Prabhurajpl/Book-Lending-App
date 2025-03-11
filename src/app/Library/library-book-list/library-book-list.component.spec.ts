import { BooksService } from 'src/app/Core/services/books.service';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { firebaseConfig } from 'src/environments/environment';

import { LibraryBookListComponent } from './library-book-list.component';
import { of, throwError } from 'rxjs';

describe('LibraryBookListComponent', () => {
  let component: LibraryBookListComponent;
  let fixture: ComponentFixture<LibraryBookListComponent>;
  let service : BooksService
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryBookListComponent ],
      imports:[HttpClientModule,
        RouterModule.forRoot([]),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig)],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryBookListComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(BooksService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should get all books', () => {
    const books = [{ title: 'Moby Dick', author: 'Herman Melville' }, { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }];
    const spy =  spyOn(service, 'getALLBooks').and.returnValue(of(books));
    component.getAllBooks()
    expect(spy).toHaveBeenCalled();
  });

  

});
