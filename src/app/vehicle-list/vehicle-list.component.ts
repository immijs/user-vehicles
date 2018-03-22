import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { } from '@angular/core';

import { Vehicle } from '../shared/vehicle.model';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  @Input('vehicles') vehicles: Vehicle[];

  constructor(private vehicleService: VehicleService) {  
  }

  ngOnInit() {
  }

  private selectVehicle(vehicle: Vehicle): void {
    this.vehicleService.selectVehicle(vehicle);
  }
}
