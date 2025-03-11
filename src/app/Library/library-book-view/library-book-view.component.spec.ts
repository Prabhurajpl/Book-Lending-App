import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { firebaseConfig } from 'src/environments/environment';

import { LibraryBookViewComponent } from './library-book-view.component';

describe('LibraryBookViewComponent', () => {
  let component: LibraryBookViewComponent;
  let fixture: ComponentFixture<LibraryBookViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryBookViewComponent ],
      imports :[HttpClientTestingModule,
        RouterModule.forRoot([]),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryBookViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should emit libraryName', () => {
    spyOn(component.Library, 'emit');
    component.sendlibraryname();
    expect(component.Library.emit).toHaveBeenCalledTimes(1);
  });



});
