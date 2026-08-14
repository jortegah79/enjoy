import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

const storage = window.localStorage;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private Storage = signal<Storage>(storage)
  constructor() { }

  saveData(key: string, data: string) {
    this.Storage().setItem(key, data);
  }
  
  getData(key: string) {
    return this.Storage().getItem(key);
  }

  isOldData() {
    const dateOld = Number(this.Storage().getItem(environment.UPDATED_EVENTS_DATE));   
    return Date.now() > dateOld;
  }

  clearAllData() {
    this.Storage().clear;
  }
}
