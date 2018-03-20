import { Injectable, Output, EventEmitter } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MessageService } from './message.service';
import { Message } from './shared/message.model';
import { USERS } from '../assets/mock-users';
import { User } from './shared/user.model';
import { Vehicle } from './shared/vehicle.model';

@Injectable()
export class UserListService {
  getUser(userid: number): User {
    var user = USERS.find(u => u.userid == userid);
    return user;
  }

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getUserList(): Observable<User[]> {
    this.messageService.addMessage(new Message('User list requested'));
    return of(USERS);
  }

  @Output('vehicleSelected') vehicleSelected: EventEmitter<Vehicle> = new EventEmitter<Vehicle>();

  public selectVehicle(vehicle: Vehicle): any {
    this.messageService.addMessage(new Message(`Vehicle (id:${vehicle.vehicleid}) selected.`));
    this.vehicleSelected.emit(vehicle);
  }
}
