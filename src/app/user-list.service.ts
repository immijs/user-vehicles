import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/take';

import { MessageService } from './message.service';
import { CacheItem } from './shared/cache-item.util';
import { Message } from './shared/message.model';
import { User } from './shared/user.model';
import { Vehicle } from './shared/vehicle.model';
import { VehicleLocation } from './shared/vehicle-location.model';

@Injectable()
export class UserListService {
  private readonly userListExpiryMilliseconds: number = 5 * 60 * 1000;
  private userListCache: CacheItem<Observable<User[]>>;

  constructor(private http: HttpClient, private messageService: MessageService) {
  }

  getUserList(): Observable<User[]> {
    try {
      this.messageService.addMessage(new Message(`user list requested`));

      let time: Date = new Date();
      let url: string = 'http://mobi.connectedcar360.net/api/?op=list';

      if (this.userListCache == null || this.userListCache.expires <= time) {
        time.setMilliseconds(time.getMilliseconds() + this.userListExpiryMilliseconds);

        this.messageService.addMessage(new Message(`user list pulled from api`));

        this.userListCache = {
          expires: time,
          item: this.http.get<{ data: User[] }>(url)
            .retry(3)
            .map(o => o.data.filter(u => u.userid != null)
              .map(u => {
                Object.assign(u, User.prototype);
                return u;
              }))
            .publishReplay(1, this.userListExpiryMilliseconds)
            .refCount()
        };
      }
      return this.userListCache.item;
    }
    catch (e) {
      this.userListCache = null;

      this.messageService.addMessage(new Message(`failed reading user list`));
      console.error(e);
      throw e;
    }
  }

  getUser(userid: number): Observable<User> {
    try {
      this.messageService.addMessage(new Message(`user requested (userid:${userid})`));

      return this.getUserList().map((users) => {
        let filtered = users.filter(u => u.userid == userid);
        if (filtered.length > 0)
          return filtered[0];

        let message = new Message(`user (userid:${userid}) not found!`);
        this.messageService.addMessage(message);
        throw new Error(message.text);
      });
    }
    catch (e) {
      this.messageService.addMessage(new Message(`failed reading user (userid:${userid})`));
      console.error(e);
      throw e;
    }
  }
}
