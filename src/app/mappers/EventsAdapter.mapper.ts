import { Event } from "../interfaces/agenda-cultural.interface";
import { SwiperEvent } from "../interfaces/SwiperEvent.interface";
import { EventList } from "../interfaces/eventlist.interface";
import { MapEvent } from "../interfaces/eventMap.interface";


export class EventAdapter {



    public static dataForSliderPrincipal(data: Event[]): SwiperEvent[] {

        const slides = data.slice(0, 5).map((event: Event) => {
            const element: SwiperEvent = {
                codi: event.codi,
                image: event.imatges.split(",").at(0) ?? "",
                denominaci: event.denominaci ?? "",
                data_inici: event.data_inici ?? new Date()
            }
            return element;
        })
        return [...slides, ...slides, ...slides];
        
    }

    public static dataForEventList(data: Event[]): EventList[] {

        return data.map((event: Event) => {
            const element: EventList = {
                codi: event.codi,
                image: event.imatges.split(",").at(0) ?? "",
                denominaci: event.denominaci ?? "",
                categorias: event.categorias,
                comarca_i_municipi: event.comarca_i_municipi,
                modalitat: event.modalitat
            }
            return element;
        })
    }

    public static dataForMapPage(data: Event[]): MapEvent[] {

        const eventsFiltered=data.filter((event:Event) =>{
            return (event.latitud && event.longitud ) || event.georefer_ncia
        })
        return eventsFiltered.map((event: Event) => {

            const element: MapEvent = {
                codi:event.codi,
                denominaci:event.denominaci??"Sense descripció",
                lat:event.latitud??event.georefer_ncia?.coordinates[0].toLocaleString()??"",
                lon:event.longitud??event.georefer_ncia?.coordinates[1].toLocaleString()??"",          
                categoria:event.categorias,      
                url:""
            }
            element['url']=`https://www.google.com/maps?q=${element.lat},${element.lon}`
            return element;
        })
    }
}