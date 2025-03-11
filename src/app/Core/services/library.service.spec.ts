import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { firebaseConfig } from 'src/environments/environment';

import { LibraryService } from './library.service';

describe('LibraryService', () => {
  let service: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports :[HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig)]
    });
    service = TestBed.inject(LibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a collection of books', () => {
    const mockLibraryNames = ['Library A', 'Library B', 'Library C'];
    // spyOn the service method
    spyOn(service,'getLibcollections').and.returnValue(of(mockLibraryNames));
    service.getLibcollections().subscribe((libraryNames : any) => {
      expect(libraryNames).toEqual(mockLibraryNames);
    });
  });

 
  
});
