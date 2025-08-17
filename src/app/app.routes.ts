import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "init",
        loadComponent: () => import("./pages/selector/selector.component"),
        children: [
            {
                path: "inicio",
                loadComponent: () => import("./pages/inicio/inicio.component")
            },
            {
                path: "map",
                loadComponent: () => import("./pages/map/map.component")
            },
            {
                path: "favoritos",
                loadComponent: () => import("./pages/favoritos/favoritos.component")
            },
            {
                path: "events",
                loadComponent: () => import("./pages/event-list/event-list.component")
            },
            {
                path: "event/:id",
                loadComponent: () => import("./pages/event/event.component")
            },
            
            {
                path: "**", redirectTo: "inicio", pathMatch: "full"
            }
        ],

    },
    {
        path: "**", redirectTo: "init", pathMatch: "full"
    }
];
