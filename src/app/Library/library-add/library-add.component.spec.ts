import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import {  ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { LibraryService } from 'src/app/Core/services/library.service';
import { firebaseConfig } from 'src/environments/environment';

import { LibraryAddComponent } from './library-add.component';

describe('LibraryAddComponent', () => {
  let component: LibraryAddComponent;
  let fixture: ComponentFixture<LibraryAddComponent>;
  let libService :any;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryAddComponent ],
      imports:[HttpClientModule,
        RouterModule.forRoot([]),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig)],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryAddComponent);
    component = fixture.componentInstance;
    libService = fixture.debugElement.injector.get(LibraryService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add library', () => {
    let libname ="lib1"
    const mockResponse = {status:"sucess"}
    spyOn(libService, 'addLibrary').withArgs("lib1").and.returnValue(mockResponse);
    libService.addLibrary(libname) 
    expect(libService.addLibrary).toHaveBeenCalledTimes(1);
  });


  it('should call getliblist method and get the result', () => {
    const mockResponse =[{added_by:"prabhurajpl66@gmail.com",
                        id:"ei7oFj6zqJDeTkDwvQ9y",
                        libname: "Library Test"}]
    const spy = spyOn(libService, 'getLibcollections').and.returnValue(of(mockResponse));
    component.getliblist()
    expect(spy).toHaveBeenCalled();
  });

  it('should call the function on keyup.enter event', () => {
    const input = fixture.debugElement.query(By.css('input'));
    spyOn(component, 'onEnter');
    input.triggerEventHandler('keyup.enter', {});
    expect(component.onEnter).toHaveBeenCalled();
  });
 
});
