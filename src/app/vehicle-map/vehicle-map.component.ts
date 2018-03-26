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
import OlLayerTile from 'ol/layer/tile';
import OlLayerVector from 'ol/layer/vector';
import OlMap from 'ol/map';
import OlProj from 'ol/proj';
import OlOSM from 'ol/source/osm';
import OlOverlay from 'ol/overlay';
import OlSourceVector from 'ol/source/vector';
import OlStyleCircle from 'ol/style/circle';
import OlStyleFill from 'ol/style/fill';
import OlStyleStroke from 'ol/style/stroke';
import OlStyleStyle from 'ol/style/style';
import OlView from 'ol/view';

import { User } from '../shared/user.model';
import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../shared/vehicle.model';
import { VehicleLocation } from '../shared/vehicle-location.model';

import { Message } from '../shared/message.model';
import { MessageService } from '../message.service';
import { locateHostElement } from '@angular/core/src/render3/instructions';
import { OverlayPositioning } from 'openlayers';
import { VehicleListComponent } from '../vehicle-list/vehicle-list.component';

@Component({
  selector: 'vehicle-map',
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.css']
})
export class VehicleMapComponent implements OnChanges, OnInit, OnDestroy {
  private vehicleLocationString = 'vehicle-location';
  private map: OlMap;
  private source: OlOSM;
  private layer: OlLayerTile;
  private view: OlView;
  private popup: OlOverlay;
  private locationsVector: OlLayerVector;
  private highlightStyle: OlStyleStyle;
  public highlightedLocation: VehicleLocation;
  //public selectedVehicle: Vehicle;

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

      this.locationsVector.setSource(new OlSourceVector({
        features: locationFeatures
      }));

      if (this.highlightedLocation == null) {
        let extent = this.locationsVector.getSource().getExtent();
        this.map.getView().fit(extent, { size: this.map.getSize(), maxZoom: 11 });
      }
      else {
        this.highlightedLocation = this.getVehicleLocation(this.highlightedLocation.vehicleid);
        setTimeout(() => {
          this.vehicleService.selectVehicle(this.highlightedLocation.vehicle);
        }, 1);
      }
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
    this.layer = new OlLayerTile({
      source: this.source
    });
    this.view = new OlView({
      center: OlProj.fromLonLat([0, 0]),
      zoom: 3,
    });
    this.map = new OlMap({
      target: 'map',
      layers: [this.layer],
      view: this.view
    });

    this.locationsVector = new OlLayerVector({
      map: this.map,
      source: new OlSourceVector({
        features: []
      })
    });

    this.popup = new OlOverlay({
      element: document.getElementById('popup')
    });
    this.map.addOverlay(this.popup);

    this.map.on('click', (event) => this.mapClicked(event));

    this.highlightStyle = new OlStyleStyle({
      image: new OlStyleCircle({
        radius: 8,
        fill: new OlStyleFill({
          color: '#ffff00'
        }),
        stroke: new OlStyleStroke({
          color: '#9B9B00',
          width: 2
        })
      })
    });
  }

  private initVehicleSelected() {
    this.vehicleSelected$ = this.vehicleService.vehicleSelected.subscribe((vehicle: Vehicle) => {
      let vehicleLocation = this.getVehicleLocation(vehicle.vehicleid);

      if (vehicleLocation != null) {
        this.highlightVehicle(vehicleLocation);
      }
      else {
        this.messageService.addDisplayMessage(new Message(`could not find location of vehicle (vehicleid:${vehicle.vehicleid})`));
      }
    });
  }

  private mapClicked(event): void {
    let features: OlFeature[] = this.map.getFeaturesAtPixel(event.pixel) as OlFeature[];
    if (features != null && features.length > 0) {
      let vehicleLocation = features[0][this.vehicleLocationString];
      this.highlightVehicle(vehicleLocation);
    }
    else if (this.highlightedLocation != null) {
      this.popup.setPosition(undefined);
      this.clearSelectedVehicleStyle();
    }
  }

  private highlightVehicle(vehicleLocation: VehicleLocation) {
    if (this.highlightedLocation != null) {
      this.clearSelectedVehicleStyle();
    }

    let coordinate = OlProj.fromLonLat([vehicleLocation.lon, vehicleLocation.lat]);

    this.view.animate({ center: coordinate, zoom: 12 }, (b: boolean) => {
      this.highlightedLocation = vehicleLocation;
      let feature = this.findVehicleLocationFeature(vehicleLocation);

      feature.setStyle(this.highlightStyle);

      let location = feature[this.vehicleLocationString] as VehicleLocation;

      let point: OlGeomPoint = <OlGeomPoint>feature.getGeometry();
      let coordinate = point.getCoordinates();

      let pixel = this.map.getPixelFromCoordinate(coordinate);

      this.popup.setPositioning(this.getPopupPositioning(pixel));
      this.popup.setPosition(coordinate);
    });
  }

  private clearSelectedVehicleStyle() {
    let selectedFeature = this.findVehicleLocationFeature(this.highlightedLocation);
    if (selectedFeature != null) {
      let vehicleStyle = this.getVehicleOriginalStyle(this.highlightedLocation.vehicle);
      selectedFeature.setStyle(vehicleStyle);
    }
  }

  private findVehicleLocationFeature(location: VehicleLocation): OlFeature {
    let coordinate = OlProj.fromLonLat([location.lon, location.lat]);
    let pixel = this.map.getPixelFromCoordinate(coordinate);
    let features: OlFeature[] = this.map.getFeaturesAtPixel(pixel) as OlFeature[];
    if (features != null && features.length > 0) {
      return features[0];
    }
    else
      return null;
  }

  private getVehicleStyle(vehicle: Vehicle): OlStyleStyle {
    if (this.highlightedLocation != null && vehicle == this.highlightedLocation.vehicle)
      return this.highlightStyle;
    else
      return this.getVehicleOriginalStyle(vehicle);
  }

  private getVehicleOriginalStyle(vehicle: Vehicle): OlStyleStyle {
    return new OlStyleStyle({
      image: new OlStyleCircle({
        radius: 6,
        fill: new OlStyleFill({
          color: vehicle.color
        }),
        stroke: new OlStyleStroke({
          color: '#fff',
          width: 2
        })
      })
    });
  }

  private getPopupPositioning(pixel): OverlayPositioning {
    return 'center-left';
  }

  ngOnDestroy() {
    this.vehicleSelected$.unsubscribe();
    if (this.vehiclePullTimer$ != null)
      this.vehiclePullTimer$.unsubscribe();
  }

  private getVehicleLocationFeature(location: VehicleLocation): OlFeature {
    let feature = new OlFeature();

    feature.setId(location.vehicleid);
    feature[this.vehicleLocationString] = location;

    feature.setStyle(this.getVehicleStyle(location.vehicle));

    let coordinate = OlProj.fromLonLat([location.lon, location.lat]);
    feature.setGeometry(new OlGeomPoint(coordinate));

    return feature;
  }
}
