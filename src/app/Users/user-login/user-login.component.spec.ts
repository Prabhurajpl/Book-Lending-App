import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { UsersService } from 'src/app/Core/services/users.service';
import { firebaseConfig } from 'src/environments/environment';

import { UserLoginComponent } from './user-login.component';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLoginComponent ],
      imports:[HttpClientModule,
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig)],
        providers:[UsersService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should be valid if form value is valid', () => {
    component.UserLoginForm.setValue({
      "email": "bobby@bobby.com", 
      "password": "123456789"
    });
    expect(component.UserLoginForm.valid).toEqual(true);
  });

  it('check login submit method response',() => {
    const formvalues = {"email":"test1@gmail.com","password":"1234556666"} 
    const service = fixture.debugElement.injector.get(UsersService)
    spyOn(service,'Login').withArgs(formvalues).and.returnValue({"status":"sucess"})
    service.Login(formvalues);
    expect(service.Login).toHaveBeenCalledTimes(1)
  })

});
