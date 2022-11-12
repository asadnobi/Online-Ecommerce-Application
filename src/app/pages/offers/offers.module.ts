import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicRatingModule } from 'ionic4-rating';

import { OffersPageRoutingModule } from './offers-routing.module';
import { OffersPage } from './offers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, LazyLoadImageModule,
    IonicRatingModule,
    OffersPageRoutingModule
  ],
  declarations: [OffersPage]
})
export class OffersPageModule {}
