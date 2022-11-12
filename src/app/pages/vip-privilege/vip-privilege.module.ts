import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { VipPrivilegePageRoutingModule } from './vip-privilege-routing.module';
import { VipPrivilegePage } from './vip-privilege.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,LazyLoadImageModule,
    VipPrivilegePageRoutingModule
  ],
  declarations: [VipPrivilegePage]
})
export class VipPrivilegePageModule {}
