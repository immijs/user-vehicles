import { Component } from '@angular/core';
import { Input } from '@angular/core';

import { Owner } from '../shared/owner.model';

@Component({
  selector: 'owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent {
  @Input('owner') owner: Owner;

  constructor() {
  }
}
