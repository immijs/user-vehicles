import { AsyncPipe } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';

import { MessageService } from '../message.service';
import { VehicleService } from '../vehicle.service';
import { Address } from '../shared/address.model';
import { Message } from '../shared/message.model';
import { VehicleLocation } from '../shared/vehicle-location.model';

@Component({
  selector: 'vehicle-overlay',
  templateUrl: './vehicle-overlay.component.html',
  styleUrls: ['./vehicle-overlay.component.css']
})
export class VehicleOverlayComponent implements OnChanges {
  public address$: Observable<Address>;

  @Input('vehicleLocation') vehicleLocation: VehicleLocation;
  constructor(private vehicleService: VehicleService, private messageService: MessageService) { }

  ngOnChanges(): void {
    if (this.vehicleLocation != null) {
      this.address$ = this.vehicleService.getAddress(this.vehicleLocation.lat, this.vehicleLocation.lon)
        .catch((e) => {
          console.error(e);
          this.messageService.addDisplayMessage(new Message(`Failed reading address.`));
          return of(e);
        });
    }
  }
}
