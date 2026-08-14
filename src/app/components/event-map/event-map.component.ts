import { AfterViewInit, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'event-map',
  imports: [],
  templateUrl: './event-map.component.html',
  styleUrl: './event-map.component.css'
})
export class EventMapComponent implements AfterViewInit {
  
  lat = input.required<string>();
  lng = input.required<string>();
  private zoom = 17;
  mapDiv = viewChild<ElementRef>("map")
  map = signal<L.Map | null>(null)

  optionsMarker: L.MarkerOptions = {
    icon: new L.DivIcon({
      html: `<div style='color:teal;font-size:10px;text-shadow:1px 1px 2px black'>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                </svg>  
            </div>` }),
    interactive: false
  }



  ngAfterViewInit(): void {
    if (!this.mapDiv()?.nativeElement) throw "Map is not defined"
    if (!this.lat() || !this.lng) throw "latLng can't be null"

    const centerPoint: L.LatLng = new L.LatLng(+this.lat(), +this.lng());
    if(!centerPoint)throw "Lat o long son invalidas"
    let map = L.map(this.mapDiv()!.nativeElement, { 
      center: centerPoint,
      dragging:false,
      zoomControl:false,
      doubleClickZoom:false,
      scrollWheelZoom:false,
    });
    this.map.set(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',).addTo(map);
    L.marker(centerPoint, this.optionsMarker).addTo(map);
    this.map()!.setView(centerPoint, this.zoom);
  }
}
