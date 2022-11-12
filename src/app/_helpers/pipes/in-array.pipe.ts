import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inArray'
})
export class InArrayPipe implements PipeTransform {

  transform(array: any[], value: any): boolean {
    if(array && value){
      return array.some(({product_id}) => product_id === value);
    }
  }

}
