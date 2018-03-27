import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';

import { MessageService } from '../message.service';
import { UserListService } from '../user-list.service';
import { Message } from '../shared/message.model';
import { User } from '../shared/user.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private userList$: Observable<User[]>;

  constructor(private userListService: UserListService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.userList$ = this.userListService.getUserList()
      .catch((e) => {
        console.error(e);
        this.messageService.addDisplayMessage(new Message(`Failed loading user list. Please refresh!`));
        return of(e);
      });
  }
}
