import { Modalitat } from "./agenda-cultural.interface";


export interface EventList {
    codi: string;
    denominaci: string;
    categorias: string[];
    image: string;
    comarca_i_municipi?: string;
    modalitat?:   Modalitat;
}