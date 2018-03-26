import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { UserListService } from '../user-list.service';
import { OwnerComponent } from '../owner/owner.component';
import { User } from '../shared/user.model';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  host: { class: 'myClass' }
})
export class UserDetailsComponent implements OnInit {
  private user$: Observable<User>;

  constructor(private route: ActivatedRoute, private userListService: UserListService) { }

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.user$ = this.userListService.getUser(id);
  }
}
