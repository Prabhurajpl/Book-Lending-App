import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { addDoc, Firestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { collection } from '@firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userEmail!: any;
  userData: any;
  useExist: boolean = false;
  isLoginedUser = false;
  private issuedBook = new BehaviorSubject<number>(0)
  countofbooks = this.issuedBook.asObservable();
  userEmail$ = new BehaviorSubject<string>("")
  userId = this.userEmail$.asObservable();
  public isLogined = new BehaviorSubject<boolean>(false);
  loginedSucesss = this.isLogined.asObservable();
  
  constructor(
    private firestore: Firestore,
    public _angularFireAuth: AngularFireAuth,
    private router: Router,
  ) {}

  changeCountofBook(newCount:number) {
    this.issuedBook.next(newCount);
  }

  SignUp(formvalues: any) :object {
    const { email: userEmail, password: userPassword } = Object.assign(formvalues);
    return this._angularFireAuth.createUserWithEmailAndPassword(userEmail, userPassword)
      .then((resp) => {
        if(resp.additionalUserInfo?.isNewUser)
        this.addUserdata(formvalues);
      })
      .catch((error) => {
        window.alert(this.customErrorMessage(error['code']));
      });
  }

  SendVerificationMail() {
    return this._angularFireAuth.currentUser
      .then((user: any) => user.sendEmailVerification())
      .then(() => {
        this.router.navigateByUrl('verify-email');
      })
      .catch((error) => {
        window.alert(this.customErrorMessage("email/Verification failed"));
      });
  }

  addUserdata(value: any) : object {
    const dbInstance = collection(this.firestore, 'Users');
    return addDoc(dbInstance, value).then((resp) => {
        console.log("adduserResponse",resp)
        this.SendVerificationMail();
      })
      .catch((err) => {
        window.alert(this.customErrorMessage("userData/add failed"));
      });
  }
  
  Login(formvalues: any) : any {
    const { email: userEmail, password: userPassword } =  Object.assign(formvalues);
    return this._angularFireAuth.signInWithEmailAndPassword(userEmail, userPassword)
      .then((resp) => {
        if (resp.user?.emailVerified !== true) {
          window.alert(this.customErrorMessage("verify/email address"));
        } else {
          this._angularFireAuth.authState.subscribe((user) => {
            if (user) {
              this.userEmail = user.email?.toString() ;
              this.isLoginedUser = true;
              this.isLogined.next(true);
              this.router.navigateByUrl('Searchbooks');
            }
          });
        }
      })
      .catch((error) => {
        window.alert(this.customErrorMessage(error['code']));
      });
  }

  customErrorMessage(code: string): string {
    switch (code) {
        case 'auth/email-already-in-use': {
            return 'Email address already exists.';
        }
        case 'auth/user-not-found' :{
           return 'There is no user record corresponding to this email.Inavalid email address or user may have been deleted.'
        }
        case 'auth/wrong-password' :{
           return 'The password is invalid'
        }
        case 'verify/email address': {
            return 'Please validate your email address. Kindly check your inbox.';
        }
        case 'email/Verification failed':{
          return 'Email verification failed';
        }
        case 'userData/add failed':{
          return 'User data add failed';
        }
        default: {
            return 'Something happened wrongly try again later.';
        }
    }
  }
   
}


