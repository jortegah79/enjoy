import { Component, computed, inject } from '@angular/core';
import { BackButtonComponent } from "../../components/back-button/back-button.component";
import { CardComponent } from "../../components/card/card.component";
import { AgendaCulturalService } from '../../services/agenda-cultural.service';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../../environments/environment.development';
import { EventAdapter } from '../../mappers/EventsAdapter.mapper';
import { EventList } from '../../interfaces/eventlist.interface';

@Component({
  selector: 'app-favoritos',
  imports: [BackButtonComponent, CardComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export default class FavoritosComponent {

  aculturalService = inject(AgendaCulturalService);
  storage = inject(StorageService);
  urlImage = computed<string>(() => {
    return this.aculturalService.logo();
  })

  favoritos = computed<EventList[]>(() => {
    const data=this.storage.getData(environment.FAVORITOS);
    if(!data) return [];
    const array= JSON.parse(data)
    return EventAdapter.dataForEventList(array);
  })


}
