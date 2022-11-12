import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { OrderDetailsPage } from './order-details.page';

const routes: Routes = [
  { path: '', component: OrderDetailsPage }
];

@NgModule({
  imports: [
    CommonModule, IonicModule, RouterModule.forChild(routes),
    FormsModule,
    LazyLoadImageModule,
  ],
  declarations: [OrderDetailsPage]
})
export class OrderDetailsPageModule {}
