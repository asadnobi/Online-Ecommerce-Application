import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardPaymentPage } from './card-payment.page';

const routes: Routes = [
  {
    path: '',
    component: CardPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardPaymentPageRoutingModule {}
