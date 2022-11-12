import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BagPageRoutingModule } from './bag-routing.module';
import { BagPage } from './bag.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicRatingModule } from 'ionic4-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, LazyLoadImageModule,
    BagPageRoutingModule,
    IonicRatingModule
  ],
  declarations: [BagPage]
})
export class BagPageModule {}
