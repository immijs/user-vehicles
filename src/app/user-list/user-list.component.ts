import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserListService } from '../user-list.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private userList$: Observable<User[]>;
  constructor(private userListService: UserListService) { }

  ngOnInit() {
    console.log(1);
    this.userList$ = this.userListService.getUserList();
    console.log(2);
  }

}
