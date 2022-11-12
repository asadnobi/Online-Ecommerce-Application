import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'specialChar'
})
export class SpecialCharPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    let newVal = (value.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim();
    return newVal;
  }

}
