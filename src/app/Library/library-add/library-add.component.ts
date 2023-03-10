import { ActivatedRoute, Router } from '@angular/router';
import { LibraryService } from './../../Core/services/library.service';
import { Library } from './../../shared/interfaces/library';
import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'library-add',
  templateUrl: './library-add.component.html',
  styleUrls: ['./library-add.component.scss'],
})
export class LibraryAddComponent implements OnInit {
  librarylist: any = [];
  @Input() selectedLib!: string;
  name!: string;


  constructor(private libservice: LibraryService,private router:Router,
    private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.getliblist();
  }
  onEnter() {
    let lib: Library = { libname: this.name };
    this.libservice.addLibrary(lib).then(() => {
      this.getliblist();
    }).catch((err) => {
       console.log("error",err.messages)
    });
    this.name = '';
  }
  librayClick(event: any) {
     this.selectedLib = event.target.text;
      this.router.navigateByUrl(`library-view/${this.selectedLib}`)
  }

  getliblist(){
   this.libservice.getLibcollections().subscribe((data)=>{
      this.librarylist = data;
   });
  }

  
}
