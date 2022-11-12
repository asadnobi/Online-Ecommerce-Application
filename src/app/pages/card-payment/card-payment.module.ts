import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {CardPaymentPageRoutingModule} from './card-payment-routing.module';
import {CardPaymentPage} from './card-payment.page';
//pluign
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CardPaymentPageRoutingModule
    ],
    declarations: [CardPaymentPage],
    providers:[InAppBrowser],
})
export class CardPaymentPageModule {
}
