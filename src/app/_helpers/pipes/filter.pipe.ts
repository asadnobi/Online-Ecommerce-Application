import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'ngFilter'
})
export class FilterPipe implements PipeTransform {

    transform(items: any[], filterText: string): any {
        if (!items) return [];
        if (!filterText) return items;
        filterText = filterText.toLowerCase().trim();

        return items.forEach(item => {
            return item['children'].filter(e => {
                return e.name.toLowerCase().trim().includes(filterText);
            });
        });

    }

}

