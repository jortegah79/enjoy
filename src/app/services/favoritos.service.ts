import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment.development';
import { Event } from '../interfaces/agenda-cultural.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  storage = inject(StorageService);
  constructor() { }

  isFavorite(codi: string) {

    const data = this.storage.getData(environment.FAVORITOS);
    if (!data) return false;
    const array: Event[] = JSON.parse(data);
    return Array.from(array).some((event: Event) => event.codi === codi)
  }

  getData() {

    const data = this.storage.getData(environment.FAVORITOS);
    const array: Event[] = data ? JSON.parse(data) : [];
    return array;
  }

}
