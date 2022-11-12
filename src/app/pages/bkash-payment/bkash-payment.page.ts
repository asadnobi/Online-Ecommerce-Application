import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {CheckoutService} from '../../services/checkout.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {SharedService} from '../../services/shared.service';
declare let bKash: any;
declare var $: any;


@Component({
    selector: 'app-bkash-payment',
    templateUrl: './bkash-payment.page.html',
    styleUrls: ['./bkash-payment.page.scss'],
})
export class BkashPaymentPage implements OnInit, OnDestroy {
    orderId: number;
    loading: boolean = false;

    constructor(
        private checkoutService: CheckoutService,
        private userService: UserService,
        private sharedService: SharedService,
        public modalCtrl: ModalController,
        public route: ActivatedRoute,
        private router: Router,
        private navCtrl: NavController
    ) {

    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.orderId = params['order_id'];
            // this.errorMessage = params['errorMsg'];
            this.getOrderDetails();
        });
    }

    ionViewDidEnter() {
        
    }

    ngOnDestroy() {
        this.orderId = null;
        this.loading = false;
    }

    getOrderDetails() {
        this.sharedService.loadingStart();
        this.userService.getOrderDetails(this.orderId).subscribe((result: any) => {
            this.sharedService.loadingClose();
            if(!result || !result['id']) {
                return false;
            }
            if(result && result['payment_media'] === 3 && result['payment_status'] === 0) {
                this.bkashPayment(result['id'], result['grand_total']);
            } else {
                this.router.navigate(['tabs/order-details', this.orderId, 1]);
            }
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    bkashPayment(invoice, amount) {
        this.loading = true;
        bKash.init({
            paymentMode: 'checkout', //fixed value ‘checkout’
            paymentRequest: {
                amount: amount, //max two decimal points allowed
                intent: 'sale'
            },
            createRequest: this.bkashInitialRequest(invoice, amount),
            executeRequestOnAuthorization: function() {
                const UserToken = localStorage.getItem('user_token');
                const paymentID = localStorage.getItem('bKashPaymentId');
                $.ajax({ 
                    url: "https://themallbd.com/api/auth/execute-bkash-payment" + "?paymentID=" + paymentID,
                    type: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + UserToken
                    },
                    timeout: 30000,
                    success: function (data) {
                        if (data) {
                            data = JSON.parse(data);
                            if (data.errorMessage) {
                                // alert(data.errorMessage);
                                window.location.href = '/tabs/order-details/' + invoice + '/1' + '?reason=' + data.errorMessage;
                                bKash.execute().onError();
                            } else {
                                if (data && data.transactionStatus === 'Completed') {
                                    $.ajax({
                                        url: 'https://themallbd.com/api/auth/confirm-bkash-payment',
                                        type: 'POST',
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                            'Authorization': 'Bearer ' + UserToken
                                        },
                                        data: {order_id: invoice, payment_id: data.paymentID, trx_id: data.trxID},
                                        success: function (data) {
                                            if (data) {
                                                window.location.href = '/tabs/order-details/' + invoice + '/1';
                                            }
                                        },
                                        error: function () {
                                            bKash.execute().onError();
                                        }
                                    });
                                } else {
                                    // alert('Please try again.');
                                    window.location.href = '/tabs/order-details/' + invoice + '/1' + '?reason=' + 'Your payment not Completed. Please try again.';
                                    bKash.execute().onError();
                                }
                            }
                        } else {
                            $.ajax({
                                url: "https://themallbd.com/api/auth/query-bkash-payment" + "?paymentID=" + paymentID,
                                type: 'GET',
                                contentType: 'application/json',
                                success: function (data) {
                                    data = JSON.parse(data);
                                    if (data.errorMessage) {
                                        // alert(data.errorMessage);
                                        window.location.href = '/tabs/order-details/' + invoice + '/1' + '?reason=' + data.errorMessage;
                                        bKash.execute().onError();
                                    } else {

                                        if (data && data.transactionStatus === 'Completed') {
                                            $.ajax({
                                                url: 'https://themallbd.com/api/auth/confirm-bkash-payment',
                                                type: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Authorization': 'Bearer ' + UserToken
                                                },
                                                data: {
                                                    order_id: invoice,
                                                    payment_id: data.paymentID,
                                                    trx_id: data.trxID
                                                },
                                                success: function (data) {
                                                    if (data) {
                                                        window.location.href = '/tabs/order-details/' + invoice + '/1';
                                                    }
                                                },
                                                error: function () {
                                                    bKash.execute().onError();
                                                }
                                            });

                                        } else {
                                            // alert('Please try again.');
                                            window.location.href = '/tabs/order-details/' + invoice + '/1' + '?reason=' + 'Your payment not Completed. Please try again.';
                                            bKash.execute().onError();
                                        }
                                    }
                                },
                                error: function () {
                                    bKash.execute().onError();
                                }
                            });
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        if (textStatus === 'timeout') {
                            $.ajax({
                                url: "https://themallbd.com/api/auth/query-bkash-payment" + "?paymentID=" + paymentID,
                                type: 'GET',
                                contentType: 'application/json',
                                success: function (data) {
                                    data = JSON.parse(data);
                                    if (data.errorMessage) {
                                        // alert(data.errorMessage);
                                        window.location.href = '/tabs/order-details/' + invoice + '/1' + '?reason=' + data.errorMessage;
                                        bKash.execute().onError();
                                    } else {
                                        if (data && data.transactionStatus === 'Completed') {
                                            $.ajax({
                                                url: 'https://themallbd.com/api/auth/confirm-bkash-payment',
                                                type: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded',
                                                    'Authorization': 'Bearer ' + UserToken
                                                },
                                                data: {
                                                    order_id: invoice,
                                                    payment_id: data.paymentID,
                                                    trx_id: data.trxID
                                                },
                                                success: function (data) {
                                                    if (data) {
                                                        window.location.href = '/tabs/order-details/' + invoice + '/1';
                                                    }
                                                },
                                                error: function () {
                                                    bKash.execute().onError();
                                                }
                                            });
                                        } else {
                                            // alert('Your payment not Completed. Please try again.');
                                            window.location.href = '/tabs/order-details/' + invoice + '/1' + '?reason=' + 'Your payment not Completed. Please try again.';
                                            bKash.execute().onError();
                                        }
                                    }
                                },
                                error: function () {
                                    bKash.execute().onError();
                                }
                            })
                            ;
                        } else {
                            bKash.execute().onError();
                        }
                    }
                });
            },
            onClose: function () {
                window.location.href = '/tabs/order-details/' + invoice + '/1';
            }
        });
    }

    bkashInitialRequest(invoice, amount) {
        this.sharedService.loadingStart();
        this.checkoutService.createBkashPayment(invoice, amount).subscribe((data: any) => {
            this.sharedService.loadingClose();
            if (data && data['paymentID'] != null) {
                window.localStorage.setItem('bKashPaymentId', data['paymentID']);
                bKash.create().onSuccess(data);
            } else { 
                bKash.create().onError();
            }
        }, err => {
            this.sharedService.loadingClose();
            bKash.create().onError();
        });
    }


    goBack() {
        this.navCtrl.back();
    }

}
