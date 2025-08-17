import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { menuRutaItem, rutaTabs } from '../../../assets/rutas';

@Component({
  selector: 'selector-tabs',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './tabs.component.html',
  })
export class TabsComponent {

  rutas:menuRutaItem[]=rutaTabs;

}
