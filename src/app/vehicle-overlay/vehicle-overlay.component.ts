import { AsyncPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { VehicleLocation } from '../shared/vehicle-location.model';
import { Address } from '../shared/address.model';
import { Observable } from 'rxjs/Observable';
import { VehicleService } from '../vehicle.service';
import { } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'vehicle-overlay',
  templateUrl: './vehicle-overlay.component.html',
  styleUrls: ['./vehicle-overlay.component.css']
})
export class VehicleOverlayComponent implements OnInit, OnChanges {

  public address$: Observable<Address>;

  @Input('vehicleLocation') vehicleLocation: VehicleLocation;
  constructor(private vehicleService: VehicleService) { }

  ngOnChanges(): void {
    if (this.vehicleLocation != null) {
      this.address$ = this.vehicleService.getAddress(this.vehicleLocation.lat, this.vehicleLocation.lon);
    }
  }

  ngOnInit() {
  }

}
