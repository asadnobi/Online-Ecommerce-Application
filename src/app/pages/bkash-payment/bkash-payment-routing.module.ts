import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BkashPaymentPage } from './bkash-payment.page';

const routes: Routes = [
  { path: '', component: BkashPaymentPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BkashPaymentPageRoutingModule {}
