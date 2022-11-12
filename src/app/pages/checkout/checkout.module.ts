import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';

import {CheckoutPageRoutingModule} from './checkout-routing.module';

import {CheckoutPage} from './checkout.page';



@NgModule({

    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        IonicModule,
        RouterModule,
        ReactiveFormsModule,
        CheckoutPageRoutingModule,
        IonicSelectableModule
    ],
    declarations: [CheckoutPage]
})
export class CheckoutPageModule {
}
