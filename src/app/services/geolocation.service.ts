import { computed, Injectable, signal } from '@angular/core';

const geolocation = () => {
  return window.navigator.geolocation
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  geolocation = signal<Geolocation>(geolocation());
  currentPosition = signal<GeolocationPosition | null>(null);

  constructor() {
    this.getCurrentLocation();
  }

   private getCurrentLocation() {
    this.geolocation().getCurrentPosition((data) => {
      this.currentPosition.set(data)
    }), (error: PositionErrorCallback) => {
      console.log(error);

    }
  }
  getWatchPosition(){
    //this.geolocation().watchPosition(success(),error())
  }
  stopWatchPosition() {
    this.geolocation().clearWatch;
  }

}
