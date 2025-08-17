import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Pipe({
  name: 'prepareImage'
})
export class PrepareImagePipe implements PipeTransform {

  transform(value: string): string {
      
   if (!value) return "images/no-foto.jpg";
   const newValue=value.replaceAll(" ","%20")
    return `${environment.DOMINIO}${newValue}`

  }

}
