import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../env';
import { Sessions } from './sessions.model';
import { User } from './user.model'
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class SessionsApi {

  // Nickname, SessionName, SessionID
  private UserDetail = new User('')
  private UserDetailSource = new BehaviorSubject(this.UserDetail)
  currentUser = this.UserDetailSource.asObservable();

  constructor(private http: HttpClient,  private cookieService: CookieService) {
    // Get data from cookie if user refresh
    this.UserDetail['SessionID'] = parseInt(this.cookieService.get('SessionID'))
  }

  // GET list of active sessions
  getSessions(): Observable<Sessions[]> {
    return this.http.get<Sessions[]>(`${API_URL}/sessions/active`);
  }

  // Bind details from Session Component
  postSession(session: string): void {
    this.UserDetail['SessionName'] = session['SessionName']
    this.UserDetail['SessionID'] = session['SessionID']
    // Use cookie to set SessionID & SessionName 
    this.cookieService.set('SessionID', session['SessionID'].toString())
  }

  // POST User Detail
  postUser(nickname: string): Observable<any> {
    this.UserDetail['Nickname'] = nickname;
    this.cookieService.set('User',nickname)
    // Get Data from cookie
    this.UserDetail['SessionName'] =  this.UserDetail['SessionName']
    this.UserDetail['SessionID'] = parseInt(this.cookieService.get('SessionID'))
    return this.http.post(`${API_URL}/users`, this.UserDetail, httpOptions)
  }

  // GET individual bugs based on ID
  getBug(id: number): Observable<any> {
    //console.log(id)
    return this.http.get<any>(`${API_URL}/bugs/${id}`)
  }

  // POST User Rating
  postBug(userVoteDetail: any): Observable<any> {
    // check UserVoteDetail not null only post  
    return this.http.post(`${API_URL}/ratings`, userVoteDetail)
  }

  // GET Sessions Details for Active and Live Status
  checkStatus(): Observable<any> {
    return this.http.get<any>(`${API_URL}/sessions/${this.UserDetail['SessionID']}`)
  }

  // GET total number of bugs
  getTotalBug(): Observable<any> {
    return this.http.get<any>(`${API_URL}/bugs/totalbugs`)
  }

  // PUT User Rating - NOT TESTED
  putBug(userVoteDetail: any): Observable<any> {
    // check UserVoteDetail not null only post  
    return this.http.put(`${API_URL}/ratings`, userVoteDetail)
  }


}
