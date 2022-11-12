import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NavController } from '@ionic/angular';
import {UserService} from 'src/app/services/user.service';
import {SharedService} from 'src/app/services/shared.service';
import {CheckoutService} from 'src/app/services/checkout.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.page.html',
    styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage {
    defaultImage: string = 'assets/images/no-img.jpg';
    details_id: number;
    details_data: any;
    backId: any;
    reason: string;

    constructor(
        public route: ActivatedRoute,
        private userService: UserService,
        private checkoutService: CheckoutService,
        private sharedService: SharedService,
        private productService: ProductService,
        private navCtrl: NavController,
        public router: Router
    ) {
        this.route.params.subscribe(params => {
            this.details_id = params['order_id'];
            this.backId = params['pageId'];
            if (this.backId === '1') {
                this.setEmptyCart();
            }
        });
        this.route.queryParams.subscribe(params => {
            if(params && params['reason']) {this.reason = params['reason']}
        });
    }

    
    ionViewDidEnter() {
        this.getOrderDetails();
    }

    getOrderDetails() {
        this.sharedService.loadingStart();
        this.userService.getOrderDetails(this.details_id).subscribe(res => {
            this.sharedService.loadingClose();
            this.details_data = res;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    setEmptyCart() {
        this.checkoutService.deleteAll();
    }

    changeTimeline(value: any) {
        this.sharedService.loadingStart();
        this.productService.changeTimeline(value).subscribe(res => {
            this.sharedService.loadingClose();
            this.details_data = res;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    payTryAgain() {
        if (this.details_data.payment_media === 3) {
            this.router.navigate(['/bkash-payment/' + this.details_id]);
        }
        if (this.details_data.payment_media === 2) {
            this.router.navigate(['/card-payment', this.details_id]);
        }
        // if (this.details_data.payment_media === 1) {
        //     this.router.navigate(['/tabs/order-details', this.details_id, 1]);
        // }
    }

    
    goBack() {
        this.navCtrl.back();
    }
}
