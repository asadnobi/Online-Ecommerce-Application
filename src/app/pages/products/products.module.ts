import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicSelectableModule } from 'ionic-selectable';

import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';

import { SpecialCharPipe } from 'src/app/_helpers/pipes/special-char.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, LazyLoadImageModule,
    ProductsPageRoutingModule,
    IonicRatingModule,
    IonicSelectableModule
  ],
  declarations: [ProductsPage, SpecialCharPipe]
})
export class ProductsPageModule {}
