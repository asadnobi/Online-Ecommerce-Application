import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
    name: 'mymap'
})
export class MyMap implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {

    }

    public transform(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }


}