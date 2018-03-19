import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { Owner } from '../shared/owner.model';

@Component({
  selector: 'owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  @Input('owner') owner: Owner;
  
  constructor() { }

  ngOnInit() {
  }

}
