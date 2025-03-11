import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { firebaseConfig } from 'src/environments/environment';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let fixture: ComponentFixture<UsersService>;
  
  const mockServices = {
   

  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(firebaseConfig),
      ],
    });
    service = TestBed.inject(UsersService);
  });

 

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it("should create a new user", () => {
    let mockaddUserResponse = {
      "id": "v8qu5RAhQ1EPEixdwzX3",
      "parent": "Ia",
      "path": "Users/v8qu5RAhQ1EPEixdwzX3"
    }
    const value ={email:"testtt@gmail.com",password:'546789456'}
    spyOn(service,'addUserdata').withArgs(value).and.returnValue(mockaddUserResponse)
    service.addUserdata(value)
    expect(service.addUserdata).toHaveBeenCalledTimes(1)
  });
})  
  
 