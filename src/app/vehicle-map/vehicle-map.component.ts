import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs';
import 'rxjs/add/observable/timer';

import OlControl from 'ol/control';
import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';
import OlTileLayer from 'ol/layer/tile';
import OlLayerVector from 'ol/layer/vector';
import OlMap from 'ol/map';
import OlProj from 'ol/proj';
import OlOSM from 'ol/source/osm';
import OlSourceVector from 'ol/source/vector';
//import OlStyleCircle from 'ol/style/circle';
import OlStyleStyle from 'ol/style/style';
import OlStyleCircle from 'ol/style/circle';
import OlStyleFill from 'ol/style/fill';
import OlStyleStroke from 'ol/style/stroke';
import OlView from 'ol/view';

import { User } from '../shared/user.model';
import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../shared/vehicle.model';
import { VehicleLocation } from '../shared/vehicle-location.model';

import { Message } from '../shared/message.model';
import { MessageService } from '../message.service';
import { locateHostElement } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'vehicle-map',
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.css']
})
export class VehicleMapComponent implements OnChanges, OnInit, OnDestroy {
  public map: OlMap;
  public source: OlOSM;
  public layer: OlTileLayer;
  public view: OlView;

  private vehicleSelected$: Subject<Vehicle>;
  private vehiclePullTimer$: Subscription;

  private readonly pullInterval: number = 60 * 1000;

  @Input('user') user: User;
  private vehicleLocations: VehicleLocation[] = [];
  private vehicleLocationFeatures: OlFeature[] = [];

  constructor(private vehicleService: VehicleService, private messageService: MessageService) { }

  ngOnChanges(): void {
    if (this.user != null) {
      this.vehiclePullTimer$ = Observable.timer(0, this.pullInterval).subscribe(() => {
        this.pullLocations();
      });
    }
  }

  private pullLocations() {
    this.vehicleService.getUserVehicleLocations(this.user.userid).subscribe((locations) => {
      this.vehicleLocations = locations;
      let locationFeatures = locations.map(location => {
        location.vehicle = this.user.vehicles.find(v => v.vehicleid == location.vehicleid);
        return this.getVehicleLocationFeature(location);
      });

      console.log(locationFeatures);

      new OlLayerVector({
        map: this.map,
        source: new OlSourceVector({
          features: locationFeatures
        })
      });
    });
  }

  private getVehicleLocation(vehicleid: number): VehicleLocation {
    return this.vehicleLocations.find(v => v.vehicleid == vehicleid);
  }

  ngOnInit() {
    this.initVehicleSelected();
    this.initMap();
  }

  private initMap() {
    this.source = new OlOSM();
    this.layer = new OlTileLayer({
      source: this.source
    });
    this.view = new OlView({
      center: OlProj.fromLonLat([6.661594, 50.433237]),
      zoom: 3,
    });
    this.map = new OlMap({
      target: 'map',
      layers: [this.layer],
      view: this.view
    });
  }

  private initVehicleSelected() {
    this.vehicleSelected$ = this.vehicleService.vehicleSelected.subscribe((vehicle: Vehicle) => {
      let location = this.getVehicleLocation(vehicle.vehicleid);
      let cartesian = OlProj.fromLonLat([location.lon, location.lat]);
      this.view.animate({ center: cartesian, zoom: 12 });
    });
  }

  ngOnDestroy() {
    this.vehicleSelected$.unsubscribe();
    if (this.vehiclePullTimer$ != null)
      this.vehiclePullTimer$.unsubscribe();
  }

  private getVehicleLocationFeature(location: VehicleLocation): OlFeature {
    let feature = new OlFeature();

    feature.setStyle(new OlStyleStyle({
      image: new OlStyleCircle({
        radius: 6,
        fill: new OlStyleFill({
          color: location.vehicle.color
        }),
        stroke: new OlStyleStroke({
          color: '#fff',
          width: 2
        })
      })
    }));

    let coordinates = OlProj.fromLonLat([location.lon, location.lat]);
    feature.setGeometry(new OlGeomPoint(coordinates));
    
    return feature;
  }
}
