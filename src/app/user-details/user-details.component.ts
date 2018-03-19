import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OwnerComponent } from '../owner/owner.component';
import { UserListService } from '../user-list.service';
import { User } from '../shared/user.model';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  private user: User;

  constructor(private route: ActivatedRoute, private userListService: UserListService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    console.log('getUser');
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    console.log(`id: ${id}`);
    this.user = this.userListService.getUser(id);
  }
}
