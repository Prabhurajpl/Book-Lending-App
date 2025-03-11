import { UsersService } from 'src/app/Core/services/users.service';
import { Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrationComponent } from './user-registration.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebaseConfig } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';

describe('UserRegistrationComponent', () => {
  let component: UserRegistrationComponent;
  let fixture: ComponentFixture<UserRegistrationComponent>;

  let userService : UsersService;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig),
      ],
      declarations: [ UserRegistrationComponent ],
      providers:[UsersService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set the allcountries when getAllcountries method is called', () => {
     component.getAllcountries()
     expect(component.allCountries.length).toBeGreaterThan(0)
  });
  it('should set the states when country selected ', () => {
    component.countryCode ='IN'
    component.onCountryselection(component.countryCode)
    expect(component.statesBasedcountry.length).toBeGreaterThan(0)
    console.log("statess",component.statesBasedcountry)
  });
  it('should set the city when state selected ', () => {
     let stateCode ="KL"
     component.countryCode ='IN'
     component.onStateselection(stateCode,component.countryCode)
     expect(component.cityBasedStates.length).toBeGreaterThan(0)
  });

  it('should be valid if form value is valid', () => {
    component.UserRegistrationForm.setValue({
      "firstname": "prabhu", 
      "lastname": " ", 
      "email": "prabhurajpl66@gmail.com",
      "password": "123456789", 
      "country": "India", 
      "state": "", 
      "city": "", 
    });
    expect(component.UserRegistrationForm.valid).toBeTruthy();
  });
  
  it("should emit the signup method response", () => {
    const formvalues = {"email":"test1@gmail.com","password":"1234556666"} 
    let mockResponse  = {
        "additionalUserInfo": "GenericAdditionalUserInfo",
        "credential": null,
        "operationType": "signIn",
        "user": "User Details"
    }
     const service = fixture.debugElement.injector.get(UsersService)
     spyOn(service,'SignUp').withArgs(formvalues).and.returnValue(mockResponse)
     service.SignUp(formvalues);
     expect(service.SignUp).toHaveBeenCalledTimes(1)
  })

});
