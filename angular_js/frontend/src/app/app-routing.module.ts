import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// user
import { SessionComponent } from './components/session/session.component'
import { UserComponent } from './components/user/user.component'
import { BugComponent } from './components/bug/bug.component'
import { UserEndComponent} from './components/user-end/user-end.component'
// admin
import {AdminloginComponent} from './components/adminlogin/adminlogin.component'
import { AdmincreatesessionsComponent } from './components/admincreatesessions/admincreatesessions.component'
import {AdminsessionslistComponent } from './components/adminsessionslist/adminsessionslist.component'
import {AdminsessionsdetailComponent} from  './components/adminsessionsdetail/adminsessionsdetail.component'
import {LeaderboardComponent} from './components/leaderboard/leaderboard.component'
import {NotFoundComponent} from './components/not-found/not-found.component'

const routes: Routes = [
  // user
  {path:'session', component:SessionComponent},
  {path:'user',component: UserComponent},
  {path:'end',component: UserEndComponent},
  
  // admin
  {path:'admin',component: AdminloginComponent},
  {path:'create',component:AdmincreatesessionsComponent},
  {path:'sessionlist', component:AdminsessionslistComponent},
  {path:'sessiondetail',component: AdminsessionsdetailComponent},
  {path:'leaderboard',component:LeaderboardComponent},

  //redirect
  {path:'', redirectTo: '/session', pathMatch: 'full'},
  {path: 'error', component: NotFoundComponent},
  {path:':id',component:BugComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation:'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// why export const routingComponents =[,,]