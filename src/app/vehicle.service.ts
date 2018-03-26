import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { CacheItem } from './shared/cache-item.util';
import { MessageService } from './message.service';
import { Message } from './shared/message.model';
import { Vehicle } from './shared/vehicle.model';
import { VehicleLocation } from './shared/vehicle-location.model';
import { User } from './shared/user.model';
import { Address } from './shared/address.model';

@Injectable()
export class VehicleService {
  @Output('vehicleSelected') vehicleSelected: EventEmitter<Vehicle> = new EventEmitter<Vehicle>();

  private readonly vehicleLocationsExpiryMilliseconds: number = 30 * 1000;
  private vehicleLocationCache = new Map<string, CacheItem<Observable<VehicleLocation[]>>>();

  constructor(private http: HttpClient, private messageService: MessageService) {
  }

  public selectVehicle(vehicle: Vehicle): any {
    this.messageService.addMessage(new Message(`vehicle selected (vehicleid:${vehicle.vehicleid})`));
    this.vehicleSelected.emit(vehicle);
  }

  public getUserVehicleLocations(userid: number): Observable<VehicleLocation[]> {
    this.messageService.addMessage(new Message(`vehicle locations requested (userid:${userid})`));
    let url: string = `http://mobi.connectedcar360.net/api/?op=getlocations&userid=${userid}`;

    try {
      let time: Date = new Date();
      let cacheItem = this.vehicleLocationCache.get(url);

      if (cacheItem == null || cacheItem.expires <= time) {
        this.messageService.addMessage(new Message(`vehicle locations pulled from api (userid:${userid})`));

        time.setMilliseconds(time.getMilliseconds() + this.vehicleLocationsExpiryMilliseconds);

        cacheItem = {
          expires: time,
          item: this.http.get<{ data: VehicleLocation[] }>(url)
            .retry(3)
            .map(o => o.data.filter(l => l.lat != null && l.lon != null))
            .publishReplay(1, this.vehicleLocationsExpiryMilliseconds)
            .refCount()
        };

        this.vehicleLocationCache.set(url, cacheItem);
      }

      return cacheItem.item;
    }
    catch (e) {
      if (this.vehicleLocationCache.has(url))
        this.vehicleLocationCache.delete(url);

      this.messageService.addDisplayMessage(new Message(`failed reading vehicle locations (userid:${userid})`));
      console.error(e);
    }
  }

  public getAddress(lat: number, lon: number): Observable<Address> {
    let url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=0&lat=${lat}&lon=${lon}`;
    return this.http.get<Address>(url);
  }
}
