import { Injectable } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { USERS } from '../assets/mock-users';
import { User } from './shared/user.model';

@Injectable()
export class UserListService {
  getUser(userid: number): User {
    console.log(`uid: ${userid}`);
    console.log(`users: ${JSON.stringify(USERS)}`);
    console.log(`users[0]: ${JSON.stringify(USERS[0].userid)}`);
    console.log(`users[1]: ${JSON.stringify(USERS[1].userid)}`);
    console.log(`users[2]: ${JSON.stringify(USERS[2].userid)}`);
    console.log(`users.find: ${JSON.stringify(USERS.find(u => u.userid == userid))}`);
    var user = USERS.find(u => u.userid == userid);
    console.log(`user: ${user}`);
    return user;
  }

  constructor(private http: HttpClient) { }

  getUserList(): Observable<User[]> {
    console.log(USERS);
    return of(USERS);
  }
}