import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Event } from '../interfaces/agenda-cultural.interface';
import { environment } from '../../environments/environment.development';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { EventAdapter } from '../mappers/EventsAdapter.mapper';
import { SwiperEvent } from '../interfaces/SwiperEvent.interface';
import { StorageService } from './storage.service';
import { MapEvent } from '../interfaces/eventMap.interface';

@Injectable({
  providedIn: 'root'
})
export class AgendaCulturalService {

  private http = inject(HttpClient);
  private storage = inject(StorageService);

  eventosPermanentes = signal<Event[]>([]);
  eventosTemporales = signal<Event[]>([]);

  categorias = signal<string[]>([]);
  comarcas = signal<string[]>([]);
  provincias = signal<string[]>([]);
  municipis = signal<string[]>([]);
  logo = signal<string>(`images/enjoy.png`)
  cargando = signal<boolean>(false);
  private BASE_URL = environment.URL;

  eventosProximos = computed<SwiperEvent[]>(() => {
    return EventAdapter.dataForSliderPrincipal(this.eventosTemporales());
  })
  eventosMap = computed<MapEvent[]>(() => {
    return EventAdapter.dataForMapPage([...this.eventosTemporales(), ...this.eventosPermanentes()]);
  })

  constructor() {
    this.getAllEvents();
  }

  getAllEvents() {
    this.cargando.set(true)
    if (!this.storage.isOldData()) {
      const data = this.storage.getData(environment.EVENTS_DATA);
      if (data) {
        const eventos: Event[] = JSON.parse(data);
        if (eventos) {
          this.getDataEventsMappedToSignals(eventos);
          this.getDataEventsTemporalesMappedToSignal(eventos);
          console.log("Recuperando data")
          this.cargando.set(false);
          return;
        }
      }
    }
    console.log('data nueva--->descargando');
    this.loadAllChunks()
      .pipe(
        tap(data => this.getDataEventsMappedToSignals(data)),
        tap(data => this.getDataEventsTemporalesMappedToSignal(data)),
        tap(data => {
          let array = [...this.eventosTemporales(), ...this.eventosPermanentes()];
          let expireTime = Date.now() + (8 * 60 * 60 * 1000);
          this.storage.saveData(environment.EVENTS_DATA, JSON.stringify(array));
          this.storage.saveData(environment.UPDATED_EVENTS_DATE, expireTime + "");
          this.cargando.set(false);
        }),
      ).subscribe();
    ;

  }


  loadAllChunks(totalRegistros = 70000, chunkSize = 10000): Observable<Event[]> {
    const totalPages = Math.ceil(totalRegistros / chunkSize);

    const requests: Observable<Event[]>[] = [];
    for (let i = 0; i < totalPages; i++) {
      const offset = i * chunkSize;
      const url = `${this.BASE_URL}?$limit=${chunkSize}&$offset=${offset}`;
      requests.push(this.http.get<Event[]>(url));
    }

    return forkJoin(requests).pipe(
      map(pages => pages.flat()) // Une todos los trozos en un solo array
    );
  }

  getDataEventsMappedToSignals(data: Event[]) {
    const categoriaSet = new Set<string>();
    const comarcasSet = new Set<string>();
    const provinciaSet = new Set<string>();
    const municipiSet = new Set<string>();
    const eventosSet = new Set<number>();
    const events = Array.from(data).filter((event: Event) => {
      if (event.amagar_dates === "true") {
        if (!eventosSet.has(+event.codi)) {
          eventosSet.add(+event.codi);
          return true;
        }
        return false;
      }
      return false;
    })

    const eventsMap = Array.from(events).map((event: Event) => {
      const categorias = event.tags_categor_es?.replaceAll("agenda:categories/", "") ?? ""
      const ambitos = event.tags_mbits?.replaceAll("agenda:ambits/", "") ?? ""
      const comarca = event.comarca?.replaceAll("agenda:ubicacions/", "") ?? ""
      const comarca_i_municipi = event.comarca_i_municipi?.replaceAll(`agenda:ubicacions/${comarca}/`, "") ?? ""
      categorias.split(',').forEach(cat => {
        if (cat) categoriaSet.add(cat)
      })
      if (comarca) {
        const dataComarca = comarca.split("/")
        if (dataComarca[0]) provinciaSet.add(dataComarca[0])
        if (dataComarca[1]) comarcasSet.add(dataComarca[1])
      }
      if (comarca_i_municipi) municipiSet.add(comarca_i_municipi.replaceAll("agenda:ubicacions/", ""))
      return {
        ...event,
        ['tags_categor_es']: categorias,
        ['categorias']: categorias.split(','),
        ['tags_mbits']: ambitos,
        ['comarca']: comarca,
        ['comarca_i_municipi']: comarca_i_municipi.replaceAll("agenda:ubicacions/", ""),
      }
    })

    this.categorias.set(Array.from(categoriaSet))
    this.provincias.set(Array.from(provinciaSet))
    this.comarcas.set(Array.from(comarcasSet))
    this.eventosPermanentes.set(eventsMap);
    this.municipis.set(Array.from(municipiSet).sort((munia: string, munib: string) => munia.localeCompare(munib)));

  }
  getDataEventsTemporalesMappedToSignal(data: Event[]) {

    const eventosSet = new Set<number>();

    const events = Array.from(data).filter((event: Event) => {
      if (!event.amagar_dates && event.data_inici && (new Date(event.data_inici) > new Date())) {
        if (!eventosSet.has( +event.codi )) {
          eventosSet.add( +event.codi );
          return true;
        }
        return false;
      }
      return false;
    })

    const eventosOrdenados = events.sort((eventoa: Event, eventob: Event) => {
      return new Date(eventoa.data_inici!).getTime() - new Date(eventob.data_inici!).getTime();
    });
    this.eventosTemporales.set(eventosOrdenados);
  }
  getEventsByCategory(category: string) {
    const events = [...this.eventosPermanentes(), ...this.eventosTemporales()];
    console.log(events.length);

    if (!category) return events;

    const eventos = events.filter((event: Event) => {
      return event.categorias && event.categorias.includes(category) ? true : false
    })
    return eventos

  }
  getEventByCodi(id: number) {
    let evento = this.eventosTemporales().filter(event => +event.codi === +id)
    if (evento.length != 0) return evento[0];
    return this.eventosPermanentes().filter(event => +event.codi === +id)[0] ?? []
  }

}
