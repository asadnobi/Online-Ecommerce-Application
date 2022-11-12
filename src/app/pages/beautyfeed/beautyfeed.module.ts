import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BeautyfeedPageRoutingModule } from './beautyfeed-routing.module';
import { BeautyfeedPage } from './beautyfeed.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, LazyLoadImageModule,
    BeautyfeedPageRoutingModule
  ],
  declarations: [BeautyfeedPage]
})
export class BeautyfeedPageModule {}
