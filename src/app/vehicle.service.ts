import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { CacheItem } from './shared/cache-item.util';
import { MessageService } from './message.service';
import { Message } from './shared/message.model';
import { Vehicle } from './shared/vehicle.model';
import { VehicleLocation } from './shared/vehicle-location.model';
import { User } from './shared/user.model';

@Injectable()
export class VehicleService {
  @Output('vehicleSelected') vehicleSelected: EventEmitter<Vehicle> = new EventEmitter<Vehicle>();

  private readonly vehicleLocationsExpiryMilliseconds: number = 30 * 1000;
  private vehicleLocationCache: Map<string, CacheItem<Observable<VehicleLocation[]>>> = new Map<string, CacheItem<Observable<VehicleLocation[]>>>();

  constructor(private http: HttpClient, private messageService: MessageService) {
  }

  public selectVehicle(vehicle: Vehicle): any {
    this.messageService.addMessage(new Message(`vehicle selected (vehicleid:${vehicle.vehicleid})`));
    this.vehicleSelected.emit(vehicle);
  }

  public getUserVehicleLocation(userid: number): Observable<VehicleLocation[]> {
    try {
      let time: Date = new Date();
      let url: string = `http://mobi.connectedcar360.net/api/?op=getlocations&userid=${userid}`;
      let cacheItem = this.vehicleLocationCache.get(url);

      if (cacheItem == null || cacheItem.expires <= time) {
        time.setMilliseconds(time.getMilliseconds() + this.vehicleLocationsExpiryMilliseconds);

        cacheItem = {
          expires: time,
          item: this.http.get<{ data: VehicleLocation[] }>(url)
            .retry(3)
            .map(o => o.data)
            .publishReplay(1, this.vehicleLocationsExpiryMilliseconds)
            .refCount()
        };

        this.vehicleLocationCache.set(url, cacheItem);
      }

      return cacheItem.item;
    }
    catch (e) {
      console.error(e);
      this.messageService.addDisplayMessage(new Message(`Failed reading user vehicle locations`));
    }
  }
}
