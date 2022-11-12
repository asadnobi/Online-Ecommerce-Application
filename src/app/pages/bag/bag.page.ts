import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonContent, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
//services
import {UserService} from 'src/app/services/user.service';
import {CheckoutService} from 'src/app/services/checkout.service';
import {ProductService} from 'src/app/services/product.service';
import {SharedService} from 'src/app/services/shared.service';
import {HttpService} from 'src/app/services/http.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
    selector: 'app-bag',
    templateUrl: './bag.page.html',
    styleUrls: ['./bag.page.scss'],
})
export class BagPage {
    defaultImage: string = 'assets/images/no-img.jpg';
    qtyPopoverOptions: any;
    cartData: any;
    userData: any;
    sub_total: number;
    grand_total: number;
    service_charge: number;

    newArrivalProductList: any;
    listDataTotal: number;
    page: number;

    cart_rules: any;
    selected_cart_rules_product: any;
    isScollTopBarShow: boolean;

    prevliilageDisText: string;
    prevliilageDisAmount: number;
    privilegeDiscountPercent: number;
    app_discount_text: string;
    app_discount_amount: number;
    app_discount_percentage: number;

    @ViewChild(IonContent, {static: true}) content: IonContent;

    constructor(
        private router: Router,
        private navCtrl: NavController,
        private httpService: HttpService,
        private checkoutService: CheckoutService,
        private userService: UserService,
        private productService: ProductService,
        private sharedService: SharedService,
        private storeService: StoreService
    ) { }

    ionViewDidEnter() {
        this.storeService.user.subscribe(res => {
            if (Object.getOwnPropertyNames(res).length !== 0) {
                if (res['isLogged']) {
                    this.userData = res['data'];
                    this.getUserPrivileges();
                } else {
                    this.privilegeDiscountPercent = 0;
                    this.prevliilageDisText = null;
                }
                this.calculateAssets();
            }
        });
        this.storeService.cartData.subscribe(res => {
            if (Object.getOwnPropertyNames(res).length !== 0) {
                this.cartData = res;
                this.calculateAssets();
            }
        });
        this.getAppSpecialDiscount();
        this.getNewArrivalProducts();
    }

    ionViewWillLeave() {
        this.prevliilageDisText = undefined;
        this.prevliilageDisAmount = undefined;
        this.privilegeDiscountPercent = undefined;
        this.app_discount_text = undefined;
        this.app_discount_amount = undefined;
        this.app_discount_percentage = undefined;
    }

    increase(product, index) {
        if (product.quantity >= product.product_in) {
            return this.sharedService.alert('Warning!', null, 'The requested quantity is not available');
        }
        let qty = product['quantity'] + 1;
        let _product = {...product, quantity: qty};
        this.checkoutService.increaseItem(_product, index).then(() => {
            this.sharedService.toast('Item updted successfully', 2000, 'success');
        });
    }

    decrease(product, index) {
        if (product.quantity <= 1) return;
        let qty = product['quantity'] - 1;
        let _product = {...product, quantity: qty};
        this.checkoutService.decreaseItem(_product, index).then(() => {
            this.sharedService.toast('Item updted successfully', 2000, 'success');
        });
    }

    removeItem(index) {
        this.checkoutService.deleteItem(index).then(() => {
            this.sharedService.toast('Item removed successfully', 2000, 'success');
        });
    }

    calculateAssets() {
        if (!this.cartData || this.cartData.length <= 0) return;
        new Promise<void>((resolve, reject) => {
            let checkInterval = setInterval(() => {
                if (this.privilegeDiscountPercent !== undefined && this.app_discount_percentage !== undefined) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 500);
        }).then(()=> {
            let tempSubTotal = 0;
            this.prevliilageDisAmount = 0;
            this.sub_total = 0;
            this.grand_total = 0;
            for (let i = 0; i < this.cartData.length; i++) {
                this.sub_total = this.sub_total + (this.cartData[i].regular_price * this.cartData[i].quantity);
                //Apply user prevliilage discount
                if (this.cartData[i].regular_price > this.cartData[i].discount_price) {
                    const tempDiscountAmt = this.cartData[i].regular_price - this.cartData[i].discount_price;
                    const discountPercent = (tempDiscountAmt * 100) / this.cartData[i].regular_price;
                    if (this.privilegeDiscountPercent > 0 && this.privilegeDiscountPercent > discountPercent) {
                        let tempDis = Number(((this.cartData[i].regular_price * this.cartData[i].quantity) * this.privilegeDiscountPercent) / 100);
                        this.prevliilageDisAmount = this.prevliilageDisAmount + tempDis;
                        tempSubTotal = tempSubTotal + ((this.cartData[i].regular_price * this.cartData[i].quantity) - tempDis);
                    } else {
                        let tempDis = Number(((this.cartData[i].regular_price * this.cartData[i].quantity) * discountPercent) / 100);
                        this.prevliilageDisAmount = this.prevliilageDisAmount + tempDis;
                        tempSubTotal = tempSubTotal + ((this.cartData[i].regular_price * this.cartData[i].quantity) - tempDis);
                        if(this.prevliilageDisText) {
                            let text = this.prevliilageDisText.split('+');
                            if(!text.some(el => el === 'Regular ')) {
                                this.prevliilageDisText = 'Regular' +' + '+ this.prevliilageDisText;
                            }
                        } else {
                            this.prevliilageDisText = 'Regular ';
                        }
                    }
                } else if (this.cartData[i].regular_price === this.cartData[i].discount_price) {
                    if (this.privilegeDiscountPercent > 0) {
                        let tempDis = Number(((this.cartData[i].regular_price * this.cartData[i].quantity) * this.privilegeDiscountPercent) / 100);
                        this.prevliilageDisAmount = this.prevliilageDisAmount + tempDis;
                        tempSubTotal = tempSubTotal + ((this.cartData[i].regular_price * this.cartData[i].quantity) - tempDis);
                    } else {
                        tempSubTotal = tempSubTotal + ((this.cartData[i].regular_price * this.cartData[i].quantity));
                    }

                }
            }
            // Apply App special discount
            if (this.sub_total > 0 && this.app_discount_percentage > 0) {
                this.app_discount_amount = Number(((this.sub_total - this.prevliilageDisAmount) * this.app_discount_percentage) / 100);
            }
    
            let tempTotalDisAmount = Number(this.app_discount_amount ? this.app_discount_amount : 0);
            this.grand_total = Number((tempSubTotal - tempTotalDisAmount) + Number(this.service_charge ? this.service_charge : 0));
    
            if (this.cartData && this.cartData.length > 0 && this.grand_total > 0 && !this.cart_rules) {
                this.getCartRulesProducts();
            }
        });
    }


    processCheckout() {
        if (!this.userData) {
            return this.sharedService.alert('Opps!', null, 'Please login first.', true, 'alert-warning').then(()=> {
                this.storeService.saveRoute('checkout');
                this.router.navigate(['/auth']);
            });
        }        
        if (!this.cartData) {
            return this.sharedService.alert('Opps!', 'Something went wrong', 'Please reset cart and add items again!', true, 'alert-warning');
        }
        if (this.selected_cart_rules_product && this.selected_cart_rules_product.length > 0) {
            this.router.navigate(['/checkout'], {
                queryParams: {cart_rules_free_product_id: this.selected_cart_rules_product[0].cart_rules_free_product_id}
            });
        } else {
            this.router.navigate(['/checkout']);
        }
    }

    getNewArrivalProducts(event?) {
        this.sharedService.loadingStart();
        this.productService.getNewArrivalProducts(this.page).subscribe(res => {
            this.sharedService.loadingClose();
            if (!this.newArrivalProductList) {
                this.newArrivalProductList = res['data'];
                this.listDataTotal = res['total'];
            } else {
                res['data'].forEach(item => {
                    this.newArrivalProductList.push(item);
                });
            }
            this.page = res['current_page'] + 1;
            if (event) {
                event.target.complete();
            }
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    loadMoreData(event) {
        this.getNewArrivalProducts(event);
        if (this.newArrivalProductList && this.newArrivalProductList.length === this.listDataTotal) {
            event.target.disabled = true;
        }
    }


    getUserPrivileges() {
        this.sharedService.loadingStart();
        this.userService.getPrivileges().subscribe(data => {
            this.sharedService.loadingClose();
            if(data) {
                this.calcPrivilegesDiscount(data['vip_privilege']);
            }
        }, err => {
            this.sharedService.loadingClose();
            if(err.error['message'] === "Unauthenticated.") {
                this.storeService.saveLoginData({ isLogged: false });
            };
        });
    }

    private calcPrivilegesDiscount(privilege_data) {
        if (privilege_data.privilege_type === 'VIP') {
            this.privilegeDiscountPercent = privilege_data.vip_discount_percentage;
            this.prevliilageDisText = privilege_data.privilege_type
        } else if (privilege_data.privilege_type === 'Loyalty') {
            this.privilegeDiscountPercent = privilege_data.loyalty_discount_percentage;
            this.prevliilageDisText = privilege_data.privilege_type
        } else if (privilege_data.privilege_type === 'Normal') {
            this.privilegeDiscountPercent = 0;
        }
    }

    calcPrivilegesDiscountByProduct(item) {
        if (item.regular_price > item.discount_price) {
            const tempDiscountAmt = item.regular_price - item.discount_price;
            const discountPercent = (tempDiscountAmt * 100) / item.regular_price;
            if (this.privilegeDiscountPercent > 0 && this.privilegeDiscountPercent > discountPercent) {
                const tempDis = (item.regular_price * this.privilegeDiscountPercent) / 100;
                return Number((item.regular_price - tempDis));
            } else {
                const tempDis = (item.regular_price * discountPercent) / 100;
                return Number((item.regular_price - tempDis));
            }
        } else if (item.regular_price === item.discount_price) {
            if (this.privilegeDiscountPercent > 0) {
                const tempDis = (item.regular_price * this.privilegeDiscountPercent) / 100;
                return Number((item.regular_price - tempDis));
            } else {
                return item.regular_price;
            }
        }
    }

    getAppSpecialDiscount() {
        this.sharedService.loadingStart();
        this.httpService.appSpecialDiscount().subscribe(result => {
            this.sharedService.loadingClose();
            if (result && result['data']) {
                this.app_discount_text = result['msg'];
                this.app_discount_percentage = result['data'].special_discount['discount_percentage'];
            } else {
                this.app_discount_percentage = 0;
            }
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    getCartRulesProducts() {
        this.sharedService.loadingStart();
        this.httpService.cartRulesProducts().subscribe((result: any) => {
            this.sharedService.loadingClose();
            if (result && result['data'].cart_rules) {
                this.cart_rules = [];
                this.selected_cart_rules_product = [];
                result['data'].cart_rules.forEach(rule => {
                    this.cart_rules.push(rule);
                });
            }
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    addCartRulesProductInBasket(product: any) {
        this.selected_cart_rules_product.push(product);
    }

    removeCartRulesProductInBasket() {
        this.selected_cart_rules_product = [];
    }

    signIn() {
        sessionStorage.setItem('route', '/tabs/bag');
        this.router.navigate(['/auth']);
    }

    pageScrolling(ev) {
        if (ev.detail.scrollTop >= 1500) {
            this.isScollTopBarShow = true;
        } else {
            this.isScollTopBarShow = false;
        }
    }

    scrollToTop() {
        this.content.scrollToTop(400);
    }


    goBack() {
        this.navCtrl.back();
    }


}
