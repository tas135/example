import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../env';
import { Sessions } from './sessions.model';
import { CookieService } from 'ngx-cookie-service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  public messageSource: BehaviorSubject<Sessions[]> = new BehaviorSubject([]);
  chosenSession: Observable<Sessions[]> = this.messageSource.asObservable();


  constructor(private http: HttpClient, private cookieService: CookieService ) { }

  // POST - create session
  createSession(sessionDetail: any): Observable<any> {
    console.log('Session Created:', sessionDetail)
    return this.http.post(`${API_URL}/sessions`, sessionDetail)
  }

  // GET - Get all created sessions 
  getAllSessions(): Observable<any> {
    return this.http.get<any>(`${API_URL}/sessions`);
  }

  // PUT - Edit Live and Active status
  editSession(sessionUpdate: any): Observable<any> {
    console.log("Edited session", sessionUpdate)
    return this.http.put(`${API_URL}/sessions`, sessionUpdate)
  }

  // GET - Leaderboard in desc order
  getLeaderboard(sessionID: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/ratings/${sessionID}`)
  }

  // Save the chosen session at Cookie 
  currentSession(session: any): void {
    this.chosenSession = session
    this.cookieService.set('sessionKey',session['SessionID'].toString())
  }

    // GET Session's Detail
  getSession(sessionID: number): Observable<any> {
      return this.http.get<any>(`${API_URL}/sessions/${sessionID}`)
    }

    // GET total number of users for each session 
  getTotalUser(sessionID: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/users/totaluser/${sessionID}`);
  }
}
