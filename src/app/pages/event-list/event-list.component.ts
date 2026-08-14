import { Component, computed, effect, inject, signal } from '@angular/core';
import { Location } from '@angular/common';

import { AgendaCulturalService } from '../../services/agenda-cultural.service';
import { ActivatedRoute,  } from '@angular/router';
import { Event } from '../../interfaces/agenda-cultural.interface';
import {  TitleCasePipe } from '@angular/common';
import { EventAdapter } from '../../mappers/EventsAdapter.mapper';
import { EventList } from '../../interfaces/eventlist.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardComponent } from "../../components/card/card.component";
import { CleanCategoryTextPipe } from '../../pipes/clean-category-text.pipe';
import { BackButtonComponent } from "../../components/back-button/back-button.component";


@Component({
  selector: 'app-event-list',
  imports: [CardComponent, CleanCategoryTextPipe, TitleCasePipe, BackButtonComponent],
  templateUrl: './event-list.component.html',
})
export default class EventListComponent {

  aroute = inject(ActivatedRoute);
  aculturalService = inject(AgendaCulturalService);
  events = signal<EventList[] | null>(null);
  params = toSignal(this.aroute.queryParamMap, { initialValue: undefined })
  location=inject(Location);
  
  urlImage=computed<string>(()=>{
    return this.aculturalService.logo();
  })

  queryParams = effect(() => {
    const categoria = this.params()?.get("categoria")?.trim() ?? "";
    const type = this.params()?.get('type')?.trim() ?? "";
    const value = this.params()?.get(type)?.trim() ?? "";   
    const events = this.aculturalService.getEventsByCategory(categoria)
    const eventosFiltered = this.filterByType(events, type, value);
    const eventosList = EventAdapter.dataForEventList(eventosFiltered);    
    this.events.set(eventosList)      
  })

  filterByType(eventos: Event[], type: string, valuetype: string) {
    const newEventsSet = new Set<Event>();
    eventos.forEach(elem => newEventsSet.add(elem));
    if (type == 'provincia') {
      return Array.from(newEventsSet).filter(event => {
        const dataComarca = event.comarca?.split("/") ?? "";
        return dataComarca[0] == valuetype.trim() ? true : false;
      })
    } else if (type == "comarca") {
      return Array.from(newEventsSet).filter(event => {
        const dataComarca = event.comarca?.split("/") ?? "";
        return dataComarca[1] == valuetype.trim() ? true : false;

      })
    } else if (type == "municipio") {
      return Array.from(newEventsSet).filter(event => event.comarca_i_municipi?.trim() == valuetype);
    }
    return Array.from(newEventsSet);
  }

  backPage() {
   this.location.back();    
  }
}
