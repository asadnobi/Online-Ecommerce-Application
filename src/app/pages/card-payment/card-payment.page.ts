import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
//plugin
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
//services
import {CheckoutService} from 'src/app/services/checkout.service';
import {SharedService} from 'src/app/services/shared.service';

@Component({
    selector: 'app-card-payment',
    templateUrl: './card-payment.page.html',
    styleUrls: ['./card-payment.page.scss'],
})
export class CardPaymentPage implements OnDestroy {
    orderId: any;
    browser: any;

    constructor(
        private checkoutService: CheckoutService,
        private sharedService: SharedService,
        private iab: InAppBrowser,
        public modalCtrl: ModalController,
        public route: ActivatedRoute
    ) {
        this.route.params.subscribe(params => {
            this.orderId = params['order_id'];
        });
    }

    ionViewDidEnter() {
        this.createCardPayment();
    }

    ngOnDestroy(): void {
        this.browser.close();
    }

    createCardPayment() {
        this.sharedService.loadingStart();
        this.checkoutService.createCardPayment(this.orderId).subscribe(result => {
            this.sharedService.loadingClose();
            if (result && result.status === 'success') {
                this.browser = this.iab.create(result.data, '_system', {location: 'no'});
            }
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

}
