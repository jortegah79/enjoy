import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, viewChildren } from '@angular/core';
import { PrepareImagePipe } from '../../pipes/prepare-image.pipe';
import { register } from 'swiper/element';


register();

@Component({
  selector: 'swiper-images',
  imports: [PrepareImagePipe],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './swiper-images.component.html',
  })
export class SwiperImagesComponent {

  imageElement=viewChildren<ElementRef<HTMLImageElement[]>>('image')
  images= input.required<string[]|null>();

  constructor(){
    this.imageElement().forEach(element=>element.nativeElement.forEach(img=>img.addEventListener("error",(e)=>{ 
    
    })))
  }
  
}