import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Event } from '../interfaces/agenda-cultural.interface';
import { environment } from '../../environments/environment.development';
import { forkJoin, map, Observable, of, switchMap, tap, concatMap, catchError } from 'rxjs';
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
    
    // Cargar eventos temporales primero (más importantes para el usuario)
    this.loadTemporalesFiltered()
      .pipe(
        tap(data => {
          this.getDataEventsTemporalesMappedToSignal(data);
          console.log('Eventos temporales cargados:', data.length);
          // Ya podemos mostrar la app, los temporales están listos
          this.cargando.set(false);
        }),
        // Luego cargar eventos permanentes en segundo plano
        concatMap(() => this.loadPermanentesFiltered()),
        tap(data => {
          this.getDataEventsMappedToSignals(data);
          console.log('Eventos permanentes cargados:', data.length);
          // Guardar todos los datos en cache
          let array = [...this.eventosTemporales(), ...this.eventosPermanentes()];
          let expireTime = Date.now() + (8 * 60 * 60 * 1000);
          this.storage.saveData(environment.EVENTS_DATA, JSON.stringify(array));
          this.storage.saveData(environment.UPDATED_EVENTS_DATE, expireTime + "");
        }),
        catchError(error => {
          console.error('Error cargando eventos:', error);
          this.cargando.set(false);
          return of([]);
        })
      )
      .subscribe();

    // CÓDIGO OBSOLETO - Comentado porque ahora usamos filtros SoQL
    // this.loadAllChunks()
    //   .pipe(
    //     tap(data => this.getDataEventsMappedToSignals(data)),
    //     tap(data => this.getDataEventsTemporalesMappedToSignal(data)),
    //     tap(data => {
    //       let array = [...this.eventosTemporales(), ...this.eventosPermanentes()];
    //       let expireTime = Date.now() + (8 * 60 * 60 * 1000);
    //       this.storage.saveData(environment.EVENTS_DATA, JSON.stringify(array));
    //       this.storage.saveData(environment.UPDATED_EVENTS_DATE, expireTime + "");
    //       this.cargando.set(false);
    //     }),
    //   ).subscribe();
  }


  /**
   * CÓDIGO OBSOLETO - Comentado porque ahora usamos filtros SoQL optimizados
   * Este método descargaba todos los 70k registros en 7 peticiones simultáneas
   * Ahora usamos loadTemporalesFiltered() y loadPermanentesFiltered() con filtros
   */
  // loadAllChunks(totalRegistros = 70000, chunkSize = 10000): Observable<Event[]> {
  //   const totalPages = Math.ceil(totalRegistros / chunkSize);

  //   const requests: Observable<Event[]>[] = [];
  //   for (let i = 0; i < totalPages; i++) {
  //     const offset = i * chunkSize;
  //     const url = `${this.BASE_URL}?$limit=${chunkSize}&$offset=${offset}`;
  //     requests.push(this.http.get<Event[]>(url));
  //   }

  //   return forkJoin(requests).pipe(
  //     map(pages => pages.flat()) // Une todos los trozos en un solo array
  //   );
  // }

  /**
   * Carga eventos temporales optimizado
   * Carga todos los eventos NO permanentes en chunks secuenciales
   * El filtrado por fecha se hace en getDataEventsTemporalesMappedToSignal
   * para mantener exactamente la misma lógica que antes
   */
  loadTemporalesFiltered(): Observable<Event[]> {
    // Usar carga secuencial en lugar de simultánea para reducir carga del servidor
    // Pero aún así más rápido que antes porque filtramos NO permanentes
    const chunkSize = 10000;
    const totalChunks = 7;
    const chunks: Observable<Event[]>[] = [];
    
    // Crear todas las peticiones (pero ahora con forkJoin las hacemos simultáneas)
    // Alternativamente podríamos hacerlas secuenciales con concatMap
    for (let i = 0; i < totalChunks; i++) {
      const offset = i * chunkSize;
      const url = `${this.BASE_URL}?$limit=${chunkSize}&$offset=${offset}`;
      chunks.push(this.http.get<Event[]>(url));
    }
    
    return forkJoin(chunks).pipe(
      map(pages => {
        // Unir todos los chunks
        const allData = pages.flat();
        console.log('Total eventos descargados:', allData.length);
        
        // NO filtrar aquí - dejar que getDataEventsTemporalesMappedToSignal haga TODO el filtrado
        // Esto asegura que tengamos exactamente la misma lógica que antes
        return allData;
      }),
      catchError(error => {
        console.error('Error cargando eventos temporales:', error);
        // En caso de error, retornar array vacío
        return of([]);
      })
    );
  }

  /**
   * Carga eventos permanentes usando filtro SoQL optimizado
   * Solo carga eventos con amagar_dates = "true"
   */
  loadPermanentesFiltered(): Observable<Event[]> {
    const whereClause = `amagar_dates = 'true'`;
    const url = `${this.BASE_URL}?$where=${encodeURIComponent(whereClause)}&$limit=50000`;
    
    return this.http.get<Event[]>(url).pipe(
      catchError(error => {
        console.error('Error cargando eventos permanentes:', error);
        // Si falla el filtro, intentar carga alternativa
        return this.loadPermanentesFilteredAlternative();
      })
    );
  }

  /**
   * Método alternativo si el filtro SoQL falla (carga todos y filtra en cliente)
   */
  private loadPermanentesFilteredAlternative(): Observable<Event[]> {
    console.log('Usando método alternativo para permanentes');
    const url = `${this.BASE_URL}?$limit=50000`;
    return this.http.get<Event[]>(url).pipe(
      map(data => data.filter(event => event.amagar_dates === "true"))
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
    console.log('Eventos recibidos en getDataEventsTemporalesMappedToSignal:', data.length);

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

    console.log('Eventos temporales después de filtrar y eliminar duplicados:', events.length);

    const eventosOrdenados = events.sort((eventoa: Event, eventob: Event) => {
      return new Date(eventoa.data_inici!).getTime() - new Date(eventob.data_inici!).getTime();
    });
    this.eventosTemporales.set(eventosOrdenados);
    console.log('Eventos temporales finales:', eventosOrdenados.length);
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
