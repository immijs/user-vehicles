import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';
import 'rxjs/add/observable/timer';

import { User } from '../shared/user.model';
import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../shared/vehicle.model';
import { VehicleLocation } from '../shared/vehicle-location.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'vehicle-map',
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.css']
})
export class VehicleMapComponent implements OnChanges, OnInit, OnDestroy {
  private vehicleSelected$: Subject<Vehicle>;
  private vehicleLocations$: BehaviorSubject<VehicleLocation[]> = new BehaviorSubject<VehicleLocation[]>([]);

  private vehiclePullTimer$: Subscription;

  private readonly pullInterval: number = 60 * 1000;

  @Input('user') user: User;

  constructor(private vehicleService: VehicleService) { }

  ngOnChanges(): void {
    if (this.user != null) {
      this.vehiclePullTimer$ = Observable.timer(0, this.pullInterval).subscribe(() => {
        this.pullLocations();
      });
    }
  }

  private pullLocations() {
    this.vehicleService.getUserVehicleLocation(this.user.userid).subscribe((locations) => {
      this.vehicleLocations$.next(locations);
    });
  }

  ngOnInit() {
    this.vehicleSelected$ = this.vehicleService.vehicleSelected.subscribe((vehicle: Vehicle) => {
      console.log(JSON.stringify(vehicle, null, 2));
    });
  }

  ngOnDestroy() {
    this.vehicleSelected$.unsubscribe();
    if (this.vehiclePullTimer$ != null)
      this.vehiclePullTimer$.unsubscribe();
  }
}
