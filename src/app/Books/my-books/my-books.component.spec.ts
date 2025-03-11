import { UsersService } from './../../Core/services/users.service';
import { LibraryService } from './../../Core/services/library.service';
import { BooksService } from './../../Core/services/books.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from 'src/environments/environment';

import { MyBooksComponent } from './my-books.component';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MyBooksComponent', () => {
  let component: MyBooksComponent;
  let fixture: ComponentFixture<MyBooksComponent>;
  let deb :DebugElement;
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ MyBooksComponent ],
      imports :[HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig)],
      providers:[BooksService]
    })
    .compileComponents().then(()=>{

    fixture = TestBed.createComponent(MyBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deb = fixture.debugElement;
    })

    

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute function on returnBooktoLib click', () => {
    let book ={ author_name: "J. K. Rowling", isbn: "1855494981",title: "Harry Potter and the Philosopher's Stone"}
    spyOn(component, 'returnBooktoLibraray');
    const button = fixture.debugElement.query(By.css('#btnreturnBooktoLib'));
    setTimeout(() => {
       button.triggerEventHandler('click', null);
    },1000);
    component.returnBooktoLibraray(book);
    expect(component.returnBooktoLibraray).toHaveBeenCalledTimes(1);
  });

});
