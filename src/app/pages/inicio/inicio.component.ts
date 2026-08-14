import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AgendaCulturalService } from '../../services/agenda-cultural.service';
import { SwiperComponent } from '../../components/swiper/swiper.component';
import { TitleCasePipe } from '@angular/common';
import { CleanCategoryTextPipe } from '../../pipes/clean-category-text.pipe';
import { Router } from '@angular/router';
import { SwiperCategoriasComponent } from "../../components/swiper-categorias/swiper-categorias.component";
import { EnjoyLoaderComponent } from "../../components/enjoy-loader/enjoy-loader.component";


@Component({
  imports: [SwiperComponent, TitleCasePipe, CleanCategoryTextPipe, ReactiveFormsModule, SwiperCategoriasComponent, EnjoyLoaderComponent],
  templateUrl: './inicio.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export default class InicioComponent {

  public acultural = inject(AgendaCulturalService);
  public fb = inject(FormBuilder);
  private router = inject(Router);
  urlImage=signal<string>(this.acultural.logo())

  public currentSelector = signal<string>("provincia");

  public filterForm: FormGroup = this.fb.group({
    categoria: [''],
    provincia: [''],
    comarca:   [''],
    municipio: ['']
  });

  submit() {
    let selection = {};
    let selector = "";
    for (let element of Object.keys(this.filterForm.value)) {
      if (this.filterForm.controls[element].value) {
        if (element != "categoria") selector = element;
        selection = {
          ...selection,
          [element]: this.filterForm.controls[element].value,
        }
      }
    }
    if (selector) {
      selection = {
        ...selection,
        type: selector
      }
    }
    this.router.navigate(['/init/events'], { queryParams: selection })
  }

  selector(event: Event) {
    const currentSelectorValue = (event.target as HTMLInputElement).value;
    this.reiniciarCamposZona();
    this.currentSelector.set(currentSelectorValue)
  }
  
  reiniciarCamposZona() {
    this.filterForm.controls['provincia'].reset("");
    this.filterForm.controls['comarca'].reset("");
    this.filterForm.controls['municipio'].reset("");
  }
}
