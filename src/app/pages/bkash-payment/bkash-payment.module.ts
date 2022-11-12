import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BkashPaymentPageRoutingModule } from './bkash-payment-routing.module';

import { BkashPaymentPage } from './bkash-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BkashPaymentPageRoutingModule
  ],
  entryComponents: [BkashPaymentPage],
  declarations: [BkashPaymentPage]
})
export class BkashPaymentPageModule {}
