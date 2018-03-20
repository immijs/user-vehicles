import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { MessageService } from './message.service';
import { UserListService } from './user-list.service';

import { MessageComponent } from './message/message.component';
import { OwnerComponent } from './owner/owner.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserListComponent } from './user-list/user-list.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleMapComponent } from './vehicle-map/vehicle-map.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    OwnerComponent,
    UserListComponent,
    UserDetailsComponent,
    VehicleListComponent,
    VehicleMapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,

    AppRoutingModule,
    MaterialModule
  ],
  providers: [UserListService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
