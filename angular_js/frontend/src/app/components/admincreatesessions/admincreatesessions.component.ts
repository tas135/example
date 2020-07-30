import { Component, OnInit } from '@angular/core';
import { Sessions } from '../../services/sessions.model';
import { AdminApiService } from '../../services/admin-api.service'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admincreatesessions',
  templateUrl: './admincreatesessions.component.html',
  styleUrls: ['./admincreatesessions.component.css']
})
export class AdmincreatesessionsComponent implements OnInit {
  session = new Sessions('');
  constructor(private AdminApi: AdminApiService, private router: Router, private cookieService: CookieService) { }
  admin_check: string
  ngOnInit() {
    // Validate admin 
    this.admin_check = this.cookieService.get('Admin')
    //check [0]: username, [1]: password 
    if (atob(atob(this.admin_check).split('!@&!')[0]) == "admin" && atob(atob(this.admin_check).split('!@&!')[1]) == "admin") {
      //pass  
    }
    else {
      this.router.navigate(['error'])
    }
  }

  onSubmit() {
    this.AdminApi.createSession(this.session).subscribe(

      (res) => {
        this.router.navigate(['sessionlist'])
      },
      (error) => {
        alert("SessionName already exists");
      }
    )
  }

  viewSession() {
    this.router.navigate(['sessionlist'])
  }

}
