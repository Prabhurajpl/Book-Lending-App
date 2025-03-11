import { Subscription, first, throwError } from 'rxjs';
import { BooksService } from './../../Core/services/books.service';
import { UsersService } from './../../Core/services/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  loading = false;
  setCount! :number ;
  subs$! :Subscription;
  constructor(private userdataservice: UsersService, private _router: Router ,private bookservice : BooksService) {}
 
 
  EMAIL_REGEXP =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  UserLoginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.minLength(1),
      Validators.pattern(this.EMAIL_REGEXP),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  ngOnInit(): void {
    

  }
  
  Loginsubmit() {
    if (this.UserLoginForm.invalid) {
      return;
    }
    const { email: userEmail, password: userPassword } = Object.assign(this.UserLoginForm.value);
    this.userdataservice.Login(this.UserLoginForm.value).then(()=>{
      this.bookservice.getLoginedUserDetails(userEmail).pipe(first())   
      .subscribe({
      next : (resp) =>{
          this.userdataservice.userEmail$.next(resp[0].firstname)
       }
      })
    }).catch((err :any) =>{
      throw new Error(err.messages)
    })
  }

  
 

}
