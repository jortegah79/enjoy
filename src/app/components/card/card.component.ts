import { Component, input } from '@angular/core';
import { EventList } from '../../interfaces/eventlist.interface';
import { PrepareImagePipe } from '../../pipes/prepare-image.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'card',
  imports: [PrepareImagePipe,RouterLink ],
  templateUrl: './card.component.html',
})
export class CardComponent {

  event = input.required<EventList>()

}
