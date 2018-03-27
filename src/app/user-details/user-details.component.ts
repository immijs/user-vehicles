import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';

import { MessageService } from '../message.service';
import { UserListService } from '../user-list.service';
import { Message } from '../shared/message.model';
import { User } from '../shared/user.model';
import { OwnerComponent } from '../owner/owner.component';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  public user$: Observable<User>;

  constructor(private route: ActivatedRoute, private router: Router, private userListService: UserListService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id'));

    this.user$ = this.userListService.getUser(id)
      .catch((e) => {
        console.error(e);
        this.messageService.addDisplayMessage(new Message(`User not found (id:${this.route.snapshot.paramMap.get('id')})`));
        this.router.navigate(['/']);
        return of(e);
      });;
  }
}
