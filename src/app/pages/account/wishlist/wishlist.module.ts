import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { WishlistPageRoutingModule } from './wishlist-routing.module';
import { WishlistPage } from './wishlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, LazyLoadImageModule,
    WishlistPageRoutingModule,
    IonicRatingModule
  ],
  declarations: [WishlistPage]
})
export class WishlistPageModule {}
