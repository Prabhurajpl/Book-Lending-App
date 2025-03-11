import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LibraryService } from './../../Core/services/library.service';
import { Library } from './../../shared/interfaces/library';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/Core/services/users.service';

@Component({
  selector: 'library-add',
  templateUrl: './library-add.component.html',
  styleUrls: ['./library-add.component.scss'],
})
export class LibraryAddComponent implements OnInit,OnDestroy {
  librarylist: any = [];
  @Input() selectedLib!: string;
  name!: string;
  userId :string ="";
  libSubscr! : Subscription;
  constructor(private libservice: LibraryService,private router:Router,
    private userDataservice: UsersService,
    private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.userDataservice.userEmail;
    this.getliblist();
  }
  onEnter() {
    let lib: Library = {libname: this.name , added_by:this.userId};
    this.libservice.addLibrary(lib).then(() => {
      this.getliblist();
    }).catch((err :any) => {
       console.log("error",err.messages)
    });
    this.name = '';
  }
  librayClick(event: any) {
     this.selectedLib = event.target.text;
      this.router.navigateByUrl(`library-view/${this.selectedLib}`)
  }

  getliblist(){
   this.libSubscr= this.libservice.getLibcollections().subscribe((data)=>{
      this.librarylist = data?.filter((item:any) => {return item.added_by === this.userId});
   });
  }

  ngOnDestroy(): void {
    this.libSubscr.unsubscribe();
  }

  
}
