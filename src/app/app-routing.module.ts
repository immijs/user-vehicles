import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { MessageComponent } from './message/message.component';
import { UserListComponent }      from './user-list/user-list.component';
import { UserDetailsComponent }  from './user-details/user-details.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'user/:id', component: UserDetailsComponent },
  { path: 'users', component: UserListComponent },
  { path: 'log', component: MessageComponent},
  { path: '*', redirectTo: '/' }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
