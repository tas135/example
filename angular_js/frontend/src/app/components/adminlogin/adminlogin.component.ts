import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {
  public username: string;
  public password: string;
  public key: string
  //error parameters
  public usernameError = "Invalid Username";
  public passwordError = "Invalid Password";
  checkUsernameFlag = true;
  checkPasswordFlag = true;


  constructor(private router: Router, private cookieService: CookieService) { }
  ngOnInit() {
  }

  checkAdminInput() {
    this.checkUsernameFlag = true;
  }

  checkPasswordInput() {
    this.checkPasswordFlag = true;
  }

  onSubmit() {
    // Set cookie and use Base 64 encoding + predefined salt '!@&!' for successful authentication
    if (this.username == "admin" && this.password == "admin") {
      this.key = btoa(btoa(this.username) + '!@&!' + btoa(this.password))
      console.log("Admin login details",this.key)
      this.cookieService.set('Admin', this.key)
      this.router.navigate(['create']);
    }
    else if (this.username != "admin") {
      this.checkUsernameFlag = false;
    }
    else if (this.password != "admin") {
      this.checkPasswordFlag = false;
    }
  }
}
