import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Sessions } from '../../services/sessions.model';
import { Leaderboard } from '../../services/leaderboard.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})

export class LeaderboardComponent implements OnInit {
  public session$: Observable<Sessions[]>
  public leaderboard: Leaderboard[]
  
  constructor(private AdminApi : AdminApiService, private router: Router, private cookieService: CookieService ) { }

  ngOnInit() {
    this.session$ = this.AdminApi.chosenSession
    // if user refresh, get details from cookie
    if(this.session$['SessionID']==undefined){
      this.session$['SessionID']=parseInt(this.cookieService.get('sessionKey'))
    }
    // Get details to show on leaderboard
    this.AdminApi.getLeaderboard(this.session$['SessionID']).subscribe(
      (res)=>{
        this.leaderboard = res
        console.log(this.leaderboard)
      }
    )
  }

}
