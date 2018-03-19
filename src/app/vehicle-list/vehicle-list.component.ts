import { Component, OnInit, EventEmitter } from '@angular/core';
import { Input, Output } from '@angular/core';

import { Vehicle } from '../shared/vehicle.model';
import { UserListService } from '../user-list.service';

@Component({
  selector: 'vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  @Input('vehicles') vehicles: Vehicle[];

  constructor(private userListService: UserListService) {
    
  }

  ngOnInit() {
  }

  private selectVehicle(vehicle: Vehicle): void {
    this.userListService.selectVehicle(vehicle);
  }
}
