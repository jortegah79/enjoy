import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import L from 'leaflet';
import { GeolocationService } from '../../services/geolocation.service';
import { AgendaCulturalService } from '../../services/agenda-cultural.service';
import { MapEvent } from '../../interfaces/eventMap.interface';

@Component({
  selector: 'map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export default class MapComponent implements AfterViewInit {

  geoservice = inject(GeolocationService);
  acultural  = inject(AgendaCulturalService);
  mapDiv     = viewChild<ElementRef>("map")
  map        = signal<L.Map | null>(null)
  coords     = signal<L.LatLng | null>(null);
  events     = signal<MapEvent[]>(this.acultural.eventosMap());

  constructor() {
    this.coords.set(this.getCoordsCurrentPosition())
  }
  getCoordsCurrentPosition(): L.LatLng {
    const current = this.geoservice.currentPosition();
    let coords: L.LatLng;
    if (!current) {
      coords = new L.LatLng(41.323100, 2.013304);
      return coords;
    }
    const latitude = current!.coords.latitude;
    const longitude = current!.coords.longitude;
    coords = new L.LatLng(latitude, longitude);
    return coords;
  }
  getMapOptions(): L.MapOptions {
    const coords = new L.LatLng(41.323100, 2.013304)
    const options: L.MapOptions = {
      attributionControl: true,
      doubleClickZoom: true,
      center: this.coords() ?? coords,
      zoomSnap: 0.5,
      zoomControl: true,
      fadeAnimation: true,
      zoomAnimation: true,
      scrollWheelZoom: true,
      dragging: true,
      maxZoom: 18,
      minZoom: 6,
    };
    return options;
  }

  getOptionsMarker(): L.MarkerOptions {
    const optionsMarker: L.MarkerOptions = {
      icon: new L.DivIcon({
        html: `<div style='color:blue;font-size:5px;text-shadow:2px 2px 1px black'>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                </svg>  
            </div>` }),
      interactive: true
    }
    return optionsMarker
  }

  ngAfterViewInit(): void {
    if (!this.mapDiv()?.nativeElement) throw "Map is not defined"
    if (!this.coords()) throw "latLng can't be null"
    const coords = new L.LatLng(41.323100, 2.013304)
    let map = L.map(this.mapDiv()!.nativeElement, this.getMapOptions())
    this.map.set(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',).addTo(map);
    this.generateMarkers(this.events(), map)
    this.map()!.setView(this.coords() ?? coords, 16);
  }

 generateMarkers(events: MapEvent[], map: L.Map) {
    events.forEach((event: MapEvent) => {

      let marker = L.marker(new L.LatLng(+event.lat, +event.lon), this.getOptionsMarker()).addTo(map)
      marker.bindPopup(`<h4>${event.denominaci}</h4><a href="/init/event/${event.codi}">Més info...</a>`);
      marker.on("click", () => marker.openPopup());
      return marker;
    });
  }


}