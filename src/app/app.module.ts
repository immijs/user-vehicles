import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserListService } from './user-list.service';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleMapComponent } from './vehicle-map/vehicle-map.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserDetailsComponent,
    VehicleListComponent,
    VehicleMapComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,

    AppRoutingModule
  ],
  providers: [UserListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
