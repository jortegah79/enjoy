
export interface menuRutaItem {
    path: string;
    title: string;
    icon: string;
    color:string;
}
export const rutaTabs: menuRutaItem[] = [
    {
        path: "inicio",
        title: "Inici",
        icon: "bi bi-house",
         color:"bg-teal-200 text-blue-500 font-bold"
    },
    {
        path: "map",
        title: "Mapa",
        icon: "bi bi-map",
        color:"bg-teal-200 text-orange-600 font-bold"
    },
    {
        path: "favoritos",
        title: "Favorits",
        icon: "bi bi-heart",
        color:"bg-teal-200 text-red-600 font-bold"
    },


]