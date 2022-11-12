import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { CommonToolbarComponent } from './common-toolbar.component';

@NgModule({
  declarations: [CommonToolbarComponent],
  exports: [CommonToolbarComponent],
  imports: [IonicModule, RouterModule, LazyLoadImageModule]
})
export class CommonToolbarModule { }
