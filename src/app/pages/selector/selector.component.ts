import { Component } from '@angular/core';
import { TabsComponent } from "../../components/tabs/tabs.component";
import { MenuComponent } from "../../components/menu/menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-selector',
  imports: [TabsComponent, MenuComponent, RouterOutlet  ],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.css'
})
export default class SelectorComponent {

}
