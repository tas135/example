import { Component, OnInit } from '@angular/core';
import { SessionsApi } from '../../services/sessions-api.service';
import { Sessions } from '../../services/sessions.model';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  title: string = 'Active Sessions';
  SessionsList :Sessions[];

  constructor(private SessionsApi: SessionsApi) { }

  ngOnInit() {
    this.getList();
  }

  getList(): void {
    this.SessionsApi.getSessions()
      .subscribe(
        (res) => {
          this.SessionsList = res;
          // Alert when there's no active session
          if(this.SessionsList.length == 0){
            alert('No active session found')
          }
        },
        (error) => { console.log(error) }
      )
  }


  onClickMe(session:string){
    console.log(session)
    this.SessionsApi.postSession(session);
  }


}
