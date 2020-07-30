
import { Component, OnInit, Input } from '@angular/core';
import { SessionsApi } from '../../services/sessions-api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})



export class UserComponent implements OnInit {
  public Nickname: string;
  constructor(private SessionsApi: SessionsApi, private router: Router) {
   }
  checkFlag = true;
  usernameError = "Username already exists"

  ngOnInit() {
  }

  checkInput() {
    this.checkFlag = true;
  }

  onSubmit() {
    //Check for live status from API 
    this.SessionsApi.checkStatus().subscribe(
      (res) => {
        if (res.LiveStatus) {
          // Post Username 
          this.SessionsApi.postUser(this.Nickname)
          .subscribe(
            (res) => {
              // If successful, navigate to start voting
              //this.router.navigate([1])  
              this.router.navigate([1])
            },
            (error) => {
              this.checkFlag = false;
              // console.log(error.status); // 403 If user existed
              //alert("Username already exists"); Alert will have hostname
    
            }
          )
        }
        else {
          alert("Session Not Started")
        }
      }

    )



  }
}
