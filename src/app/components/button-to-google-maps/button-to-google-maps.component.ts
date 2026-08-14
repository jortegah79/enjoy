import { AfterViewInit, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'button-to-google-maps',
  imports: [],
  templateUrl: './button-to-google-maps.component.html',
})
export class ButtonToGoogleMapsComponent implements AfterViewInit{

  lat = input.required<string>();
  lon = input.required<string>();
  urlGoogleMaps = signal<string>("")
  
  ngAfterViewInit(): void {   
  if (!this.lat() ) throw "Lat debe de tener un valor correcto";
  if (!this.lon()) throw "Lon debe de tener un valor correcto";
  const url=`https://www.google.com/maps?q=${this.lat()},${this.lon()}`;
  this.urlGoogleMaps.set(url)  
  }

}
