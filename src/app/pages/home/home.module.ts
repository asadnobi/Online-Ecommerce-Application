import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { IonicRatingModule } from 'ionic4-rating';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SwiperModule } from 'swiper/angular';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule, IonicModule, HomePageRoutingModule,
    FormsModule,
    IonicRatingModule, LazyLoadImageModule, SwiperModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
