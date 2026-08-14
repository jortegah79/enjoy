import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CleanCategoryTextPipe } from '../../pipes/clean-category-text.pipe';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

register();

@Component({
  selector: 'swiper-text-elements',
  imports: [CleanCategoryTextPipe, TitleCasePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './swiper-categorias.component.html',
})
export class SwiperCategoriasComponent {

  router = inject(Router);

  data = input.required<string[]>();
  title = input.required<string>();

  goToList(item: string) {
    this.router.navigate(['/init/events'], {
      queryParams: {
        "categoria": item
      }
    })
  }

}
