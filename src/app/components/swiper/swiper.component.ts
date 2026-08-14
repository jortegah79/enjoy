import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { SwiperEvent } from '../../interfaces/SwiperEvent.interface';
import { PrepareImagePipe } from "../../pipes/prepare-image.pipe";
import { DatePipe,  SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

register();

@Component({
  selector: 'swiper-inicio',
  imports: [PrepareImagePipe,SlicePipe,DatePipe,RouterLink],
  templateUrl: './swiper.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  
})
export class SwiperComponent {

  eventosProximos = input<SwiperEvent[]>();

}
