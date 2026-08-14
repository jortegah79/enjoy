import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { menuRutaItem, rutaTabs } from '../../../assets/rutas';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'selector-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
})
export class MenuComponent {

  rutas: menuRutaItem[] = rutaTabs;
  appName = environment.APP_NAME;

}
