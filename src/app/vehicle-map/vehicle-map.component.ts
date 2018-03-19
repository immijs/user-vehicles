import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserListService } from '../user-list.service';
import { Vehicle } from '../shared/vehicle.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'vehicle-map',
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.css']
})
export class VehicleMapComponent implements OnInit, OnDestroy {
  $vehicleSelected: Observable<Vehicle>;
  vehicleSelected$: Subject<Vehicle>;

  @Input('vehicles') vehicles: Vehicle[];

  constructor(private userListService: UserListService) { }

  ngOnInit() {
    this.vehicleSelected$ = this.userListService.vehicleSelected.subscribe((vehicle: Vehicle) =>{
      console.log(JSON.stringify(vehicle, null, 2));
    });
  }

  ngOnDestroy() {
    this.vehicleSelected$.unsubscribe();
  }

}
