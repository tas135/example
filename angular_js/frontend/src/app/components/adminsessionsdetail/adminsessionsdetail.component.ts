import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service'
import { Router } from '@angular/router'
import { Observable } from 'rxjs';
import { Sessions } from '../../services/sessions.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-adminsessionsdetail',
  templateUrl: './adminsessionsdetail.component.html',
  styleUrls: ['./adminsessionsdetail.component.css']
})
export class AdminsessionsdetailComponent implements OnInit {
  public session = new Sessions('')
  admin_check: string
  constructor(private AdminApi: AdminApiService, private router: Router, private cookieService: CookieService) { }
  public totalUser: number
  ngOnInit() {

    // Validate admin 
    this.admin_check = this.cookieService.get('Admin')
    //check [0]: username, [1]: password 
    if (atob(atob(this.admin_check).split('!@&!')[0]) == "admin" && atob(atob(this.admin_check).split('!@&!')[1]) == "admin") {
      // Get session detail to display, fw: parse data correctly
      this.session['SessionName'] = this.AdminApi.chosenSession['SessionName']
      this.session['Location'] = this.AdminApi.chosenSession['Location']
      this.session['ActiveStatus'] = this.AdminApi.chosenSession['ActiveStatus']
      this.session['LiveStatus'] = this.AdminApi.chosenSession['LiveStatus']
      this.session['DateTime'] = this.AdminApi.chosenSession['DateTime']
      this.session['SessionID'] = this.AdminApi.chosenSession['SessionID']

      // Get total number of user 
      this.AdminApi.getTotalUser(this.session['SessionID']).subscribe(
        (res) => {
          this.totalUser = res
        }
      )
      // if user refresh, get details from cookie's sessionID
      if (this.session['SessionID'] == undefined) {
        this.AdminApi.getSession(parseInt(this.cookieService.get('sessionKey'))).subscribe(
          (res) => {
            this.session = res
          }
        )
        this.AdminApi.getTotalUser(this.session['SessionID']).subscribe(
          (res) => {
            this.totalUser = res
          }
        )
      }

    }
    else {
      this.router.navigate(['error'])
    }

  }

  clickLeaderboard() {
    // fw:check if the route is valid only redirect 
    this.router.navigate(['leaderboard'])
  }
  // two buttons 
  updateStatus() {
    this.AdminApi.editSession(this.session).subscribe(
      (res) => {
      }
    )
  }
}
