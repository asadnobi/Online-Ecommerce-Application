import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ProductDetailsPageRoutingModule } from './product-details-routing.module';

import { ProductDetailsPage } from './product-details.page';
//pipes
import { SafePipe } from 'src/app/_helpers/pipes/safe.pipe';
import { InArrayPipe } from 'src/app/_helpers/pipes/in-array.pipe';
//plugin
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule, LazyLoadImageModule,
    ProductDetailsPageRoutingModule,
    IonicRatingModule
  ],
  declarations: [ProductDetailsPage, SafePipe, InArrayPipe],
  providers: [SocialSharing]
})
export class ProductDetailsPageModule {}
