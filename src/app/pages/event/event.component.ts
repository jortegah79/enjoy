import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendaCulturalService } from '../../services/agenda-cultural.service';
import { Event } from '../../interfaces/agenda-cultural.interface';
import { SwiperImagesComponent } from "../../components/swiper-images/swiper-images.component";
import { DatePipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { CleanCategoryTextPipe } from '../../pipes/clean-category-text.pipe';
import { EventMapComponent } from '../../components/event-map/event-map.component';
import { ButtonToGoogleMapsComponent } from '../../components/button-to-google-maps/button-to-google-maps.component';
import { StorageService } from '../../services/storage.service';
import { BackButtonComponent } from "../../components/back-button/back-button.component";
import { FavoritosService } from '../../services/favoritos.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-event',
  imports: [SwiperImagesComponent, CleanCategoryTextPipe, TitleCasePipe, DatePipe, EventMapComponent, ButtonToGoogleMapsComponent, BackButtonComponent,SlicePipe],
  templateUrl: './event.component.html',
})
export default class EventComponent {

  public aroute = inject(ActivatedRoute);
  public acultural = inject(AgendaCulturalService);
  public router = inject(Router);
  public storage = inject(StorageService);
  public favoritesService = inject(FavoritosService);

  paramMap = toSignal(this.aroute.params);
  id = signal<number>(0)
  event = signal<Event | null>(null);

  eventImatges = computed(() => {
    if (this.event()?.imatges) {
      return [...this.event()!.imatges.split(','), ...this.event()!.imatges.split(',')];
    }
    return [];
  })

  parametros = effect(() => {
    const { id } = this.paramMap()!;
    const eventoFiltered = this.acultural.getEventByCodi(id)
    this.event.set(eventoFiltered)
  })

  goToList(item: string) {
    this.router.navigate(['/init/events'], {
      queryParams: {
        "categoria": item
      }
    })
  }

  setFavorite() {
    const array = this.favoritesService.getData();
    if (this.favoritesService.isFavorite(this.event()!.codi)) {
      const newArray = array.filter((event: Event) => event.codi !== this.event()!.codi)
      this.storage.saveData(environment.FAVORITOS, JSON.stringify(newArray))
    } else {
      const newArray = [this.event(),...array ];
      this.storage.saveData(environment.FAVORITOS, JSON.stringify(newArray))
    }
  }
}

