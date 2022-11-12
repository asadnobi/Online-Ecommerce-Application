import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteInfoPageRoutingModule } from './site-info-routing.module';

import { SiteInfoPage } from './site-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    SiteInfoPageRoutingModule
  ],
  declarations: [SiteInfoPage]
})
export class SiteInfoPageModule {}
