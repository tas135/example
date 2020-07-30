import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
// Components
import { AppComponent } from './app.component';
import { SessionComponent } from './components/session/session.component';
import { UserComponent } from './components/user/user.component';
import { BugComponent } from './components/bug/bug.component';
import { UserEndComponent } from './components/user-end/user-end.component';
import { AdminloginComponent } from './components/adminlogin/adminlogin.component';
import { AdmincreatesessionsComponent } from './components/admincreatesessions/admincreatesessions.component';
import { AdminsessionslistComponent } from './components/adminsessionslist/adminsessionslist.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { AdminsessionsdetailComponent } from './components/adminsessionsdetail/adminsessionsdetail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
// Services 
import { AdminApiService } from './services/admin-api.service';
import { SessionsApi } from './services/sessions-api.service';
// Cookies 
import { CookieService } from 'ngx-cookie-service';
// Detect device 
import { DeviceDetectorModule } from 'ngx-device-detector';
@NgModule({
  declarations: [
    AppComponent,
    SessionComponent,
    UserComponent,
    BugComponent,
    UserEndComponent,
    AdminloginComponent,
    AdmincreatesessionsComponent,
    AdminsessionslistComponent,
    LeaderboardComponent,
    AdminsessionsdetailComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DeviceDetectorModule.forRoot()
  ],  
  providers: [SessionsApi,CookieService
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
