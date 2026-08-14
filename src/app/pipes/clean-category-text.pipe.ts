import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanCategoryText'
})
export class CleanCategoryTextPipe implements PipeTransform {

  transform(category: string,): string {

    return category.replaceAll("-", " ").replaceAll("agenda:ambits/","").replaceAll("agenda:altres categories/","");
  }

}
