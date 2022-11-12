import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicRatingModule } from 'ionic4-rating';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { VipPrivilegeDetailsPageRoutingModule } from './vip-privilege-details-routing.module';

import { MyMap } from 'src/app/_helpers/pipes/mymap.pipe';

import { VipPrivilegeDetailsPage } from './vip-privilege-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VipPrivilegeDetailsPageRoutingModule,
    IonicRatingModule, LazyLoadImageModule
  ],
  declarations: [VipPrivilegeDetailsPage, MyMap]
})
export class VipPrivilegeDetailsPageModule {}
