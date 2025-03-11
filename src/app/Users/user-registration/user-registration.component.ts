import { Router } from '@angular/router';
import { UsersService } from './../../Core/services/users.service';
import { Component, OnInit } from '@angular/core';
import { Country, State, City } from 'country-state-city';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {

  allCountries!: any;
  statesBasedcountry!: any;
  cityBasedStates!: any;
  countryCode!: string;
  constructor(private userservice: UsersService, private _router: Router) { }
  
  EMAIL_REGEXP = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  UserRegistrationForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(1), Validators.pattern(this.EMAIL_REGEXP)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6),]),
    country: new FormControl('', Validators.required),
    state: new FormControl(''),
    city: new FormControl(''),
  })

  ngOnInit(): void {
    this.getAllcountries();
  }
  getAllcountries(){
    this.allCountries = Country.getAllCountries()
  }

  onCountryselection(value: string) {
    this.countryCode = value;
    this.statesBasedcountry = State.getStatesOfCountry(value);
  }
  onStateselection(state: string,countrycode?:string) {
    countrycode = this.countryCode;
    this.cityBasedStates = City.getCitiesOfState(countrycode, state);
  }

  userRegistrationSubmit() {
    if(this.UserRegistrationForm.invalid){
          return
        }
    this.userservice.SignUp(this.UserRegistrationForm.value);
  }
  
}
