import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service'
import { Router } from '@angular/router'
import { Sessions } from '../../services/sessions.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-adminsessionslist',
  templateUrl: './adminsessionslist.component.html',
  styleUrls: ['./adminsessionslist.component.css']
})
export class AdminsessionslistComponent implements OnInit {

  constructor(private AdminApi: AdminApiService, private router: Router, private cookieService: CookieService) { }
  sessionList: Sessions[]
  admin_check: string
  ngOnInit() {  
    // Validate admin 
    this.admin_check = this.cookieService.get('Admin')
    //check [0]: username, [1]: password 
    if (atob(atob(this.admin_check).split('!@&!')[0]) == "admin" && atob(atob(this.admin_check).split('!@&!')[1]) == "admin") {
      // GET-Show all sessions from database
      this.AdminApi.getAllSessions().subscribe(
        (res) => {
          this.sessionList = res
        }
        // fw: throw response when there's error
      )
    }
    else {
      this.router.navigate(['error'])
    }

  }

  // PUT- Update Active & Live Status at database, fw: whole row editable
  updateStatus(session) {
    this.AdminApi.editSession(session).subscribe(
      (res) => {
      }
    )
  }

  // Get clicked session name 
  selectedSession(session) {
    this.AdminApi.currentSession(session)
    this.router.navigate(['sessiondetail'])
  }
}
