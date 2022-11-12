import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { IonicRatingModule } from 'ionic4-rating';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { OrdersPage } from './orders.page';

const routes: Routes = [
  { path: '', component: OrdersPage }
];

@NgModule({
  imports: [
    CommonModule, IonicModule, RouterModule.forChild(routes),
    FormsModule,
    IonicRatingModule,
    LazyLoadImageModule
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
