import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ModalController, AlertController, NavController, Platform} from '@ionic/angular';
// import {PixelService} from 'ngx-pixel';
import { config } from 'src/app/config';
//components
import {AddAddressComponent} from 'src/app/modals/add-address/add-address.component';
//servicers
import {HttpService} from 'src/app/services/http.service';
import {CheckoutService} from 'src/app/services/checkout.service';
import {SharedService} from 'src/app/services/shared.service';
import {UserService} from 'src/app/services/user.service';
import { StoreService } from 'src/app/services/store.service';

class CityType {
    public id: number;
    public name: string;
}
class AreaType {
    public id: number;
    public name: string;
}

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage {
    deliveryChargeList: any;
    form: FormGroup;
    submitted: boolean;
    public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public phoneRegex = /^(?:\+?88|0088)?01[34-9]\d{8}$/;
    cartData: any;
    userData: any;
    sub_total: number;
    delivery_charge: number;
    grand_total: number;
    service_charge: number;
    bkashPaymentID: any = '';
    userPrivileges: any;
    couponData: any;
    selectedCouponId: number;
    deliveryAddressList: any;
    addMoreAdds: Boolean = false;

    shippingCity: number = null;
    cart_rules_free_product_id: any;

    prevliilageDisText: string;
    prevliilageDisAmount: number;
    privilegeDiscountPercent: number;
    couponDisText: string;
    couponDisAmount: number;
    app_discount_text: string;
    app_discount_amount: number;
    app_discount_percentage: number;

    cityList: CityType[];
    areaList: AreaType[];

    isFreeShipping: boolean;

    constructor(
        private httpService: HttpService,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public fb: FormBuilder,
        private checkoutService: CheckoutService,
        private sharedService: SharedService,
        private userService: UserService,
        public router: Router,
        public route: ActivatedRoute,
        // private pixel: PixelService,
        private storeService: StoreService,
        private platform: Platform
    ) {
        this.form = this.fb.group({
            first_name: ['', [Validators.required, Validators.minLength(2)]],
            last_name: ['', [Validators.required, Validators.minLength(2)]],
            mobile_number: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
            email: ['', [Validators.pattern(this.emailRegex)]],
            address: ['', [Validators.required]],
            city: ['', [Validators.required]],
            area: [''],
            order_delivery_address_check: [false],
            order_delivery_address: [''],
            shipping_method: [0, [Validators.required]],
            payment_method: [1, [Validators.required]],
            comments: [''],
            coupon: [null],
            terms_and_conditions: [true, [Validators.requiredTrue]]
        });
        this.form.valueChanges.subscribe(val => { 
            // console.log(val);
            this.submitted = false; 
        });
    }

    ionViewDidEnter() {
        this.submitted = false;
        this.route.queryParams.subscribe(params => {
            if (params['cart_rules_free_product_id']) {
                this.cart_rules_free_product_id = Number(params['cart_rules_free_product_id']);
            }
        });
        this.storeService.user.subscribe(res => {
            if (Object.getOwnPropertyNames(res).length !== 0) {
                if (res['isLogged']) {
                    this.userData = res['data'];
                    this.form.patchValue({
                        email: this.userData.email ? this.userData.email : '',
                        first_name: this.userData.first_name ? this.userData.first_name : '',
                        last_name: this.userData.last_name ? this.userData.last_name : '',
                        mobile_number: this.userData.phone ? this.userData.phone : this.userData.phone2,
                        address: this.userData.address ? this.userData.address : ''
                    });
                    this.getUserPrivileges();
                    this.get_area().then(()=> {
                        this.setCityArea();
                    });
                } else {
                    this.privilegeDiscountPercent = 0;
                    this.prevliilageDisText = null;
                    return this.router.navigate(['/auth']);
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
        this.getDeliveryCharge();
        this.isFreeShipping = false;
    }

    get_area() {
        return new Promise<void>((resolve, reject) => {
            this.sharedService.loadingStart();
            this.httpService.getAreaData().subscribe(res => {
                this.sharedService.loadingClose();
                this.cityList = [];
                this.areaList = [];
                res.forEach(ele => {
                    if (ele.parent_id === 0) {
                        this.cityList.push({id: ele['id'], name: ele['name']});
                    } else if (ele.parent_id === 1) {
                        this.areaList.push({id: ele['id'], name: ele['name']});
                    }
                });
                resolve();
            }, err => {
                this.sharedService.loadingClose();
                //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
                reject();
            });
        })
    }


    getDeliveryCharge() {
        this.sharedService.loadingStart();
        this.httpService.deliveryCharge().subscribe(res => {
            this.sharedService.loadingClose();
            if(res) this.deliveryChargeList = res;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    private setCityArea() {
        let interval = setInterval(() => {
            if (this.userData && this.cityList && this.areaList) {
                if (this.cityList && this.cityList.length > 0) {
                    const cityIndex = this.cityList.findIndex(item => item.id === this.userData.city_id);
                    if (cityIndex && cityIndex !== -1) {
                        this.form.controls['city'].setValue(this.cityList[cityIndex]);
                    }
                }
                if (this.areaList && this.areaList.length > 0) {
                    const areaIndex = this.areaList.findIndex(item => item.id === this.userData.area_id);
                    if (areaIndex && areaIndex !== -1) {
                        this.form.controls['area'].setValue(this.areaList[areaIndex]);
                    }
                }
                clearInterval(interval);
            }
        }, 100);
    }


    get f() {
        return this.form.controls;
    }

    calculateAssets() {
        if (!this.cartData || this.cartData.length <= 0) return;
        new Promise<void>((resolve, reject) => {
            let checkInterval = setInterval(() => {
                if (
                    this.privilegeDiscountPercent !== undefined && 
                    this.app_discount_percentage !== undefined &&
                    this.deliveryChargeList !== undefined
                ) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 500);
        }).then(()=> {
            let tempSubTotal = 0;
            this.prevliilageDisAmount = 0;
            this.sub_total = 0;
            this.grand_total = 0;
            let CheckoutProductIds = [];
            let CheckoutProductContents = [];
            let numberofItems = 0;
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
            // Apply Coupon discount
            if (this.couponData && this.couponData.coupon_discount > 0 && this.couponData.coupon_type === 'amount') {
                this.couponDisText = 'Coupon Discount';
                this.couponDisAmount = this.couponData.coupon_discount;
            }
            // Apply App special discount
            if (this.sub_total > 0 && this.app_discount_percentage > 0) {
                this.app_discount_amount = Number(((this.sub_total - this.prevliilageDisAmount) * this.app_discount_percentage) / 100);
            }
            // Calculate city wise shipping cost
            if ((this.shippingCity === null && (this.form.value && this.form.value.city.id === 1)) || (this.shippingCity != null && this.shippingCity === 1)) {
                this.form.patchValue({shipping_method: 1}); // mall bd
            } else if ((this.shippingCity === null && (this.form.value && this.form.value.city.id > 1)) || (this.shippingCity != null && this.shippingCity > 1)) {
                this.form.patchValue({shipping_method: 2}); // S.A poribohon
            }
            if (this.deliveryChargeList && this.deliveryChargeList.length > 0) {
                const data = this.deliveryChargeList.find(f => f.type === Number(this.form.value.shipping_method) && f.status === 1);
                if (!data) return false;
                if (data.free_limit && (this.sub_total > data.free_limit)) {
                    this.delivery_charge = 0;
                } else {
                    this.delivery_charge = data.amount;
                }
            }

            if(this.isFreeShipping) this.delivery_charge = 0;

            let tempTotalDisAmount = Number(this.couponDisAmount ? this.couponDisAmount : 0) + Number(this.app_discount_amount ? this.app_discount_amount : 0);
            this.grand_total = Number((tempSubTotal - tempTotalDisAmount) + Number(this.delivery_charge ? this.delivery_charge : 0) + Number(this.service_charge ? this.service_charge : 0));
            if ((!this.grand_total || this.grand_total === 0) || (!numberofItems || numberofItems === 0)) {
                return false;
            }
            //for facebook pixel
            /*
            this.pixel.track('InitiateCheckout', {
                content_category: 'product',
                content_ids: CheckoutProductIds,
                contents: CheckoutProductContents,
                currency: 'BDT',
                num_items: numberofItems,
                value: this.grand_total
            });
            */
        });
    }


    confirmOrder() {
        this.submitted = true;
        if (this.form.status === 'INVALID') {
            this.sharedService.alert('Warning!', null, 'Please confirm required field');
            return false;
        } else {
            if (!this.cartData || this.cartData.length <= 0) {
                this.sharedService.alert('Warning!', null, 'Please add items in your cart');
                return false;
            }
            if (this.form.value.order_delivery_address_check && !this.form.value.order_delivery_address) {
                this.sharedService.alert('Warning!', null, 'Please select shipping address!!');
                return false;
            }
            if (this.form.value.shipping_method === 0) {
                this.sharedService.alert('Warning!', null, 'Please select city and area!!');
                return false;
            }
            const formData = {
                first_name: this.form.value.first_name ? this.form.value.first_name : null,
                last_name: this.form.value.last_name ? this.form.value.last_name : null,
                mobile_number: this.form.value.mobile_number ? this.form.value.mobile_number : null,
                email: this.form.value.email ? this.form.value.email : null,
                address: this.form.value.address ? this.form.value.address : null,
                city: this.form.value.city.id ? this.form.value.city.id : null,
                area: this.form.value.area.id && this.form.value.city.id === 1 ? this.form.value.area.id : null,
                order_delivery_address: this.form.value.order_delivery_address_check && this.form.value.order_delivery_address ? this.form.value.order_delivery_address : null,
                shipping_method: this.form.value.shipping_method ? this.form.value.shipping_method : null,
                payment_method: this.form.value.payment_method ? this.form.value.payment_method : null,
                comments: this.form.value.comments ? this.form.value.comments : null,
                coupon: this.form.value.coupon && this.couponData ? this.selectedCouponId : null,
                terms_and_conditions: this.form.value.terms_and_conditions ? this.form.value.terms_and_conditions : null,
                app_version: this.platform.is('ios') ? config.app_version.ios_version : this.platform.is('android') ? config.app_version.andriod_version : null,
                app_device: this.platform.platforms()
            }
            const phoneComponents = {
                IDDCC: formData['mobile_number'].substring(0, formData['mobile_number'].length - 11),
                NN: formData['mobile_number'].substring(formData['mobile_number'].length - 11, formData['mobile_number'].length)
            };
            formData['mobile_number'] = phoneComponents['NN'];

            const product_ids = [];
            const product_quantities = [];
            const purchaseProductContents = [];
            this.cartData.forEach(ele => {
                purchaseProductContents.push({'id': ele['name'], 'quantity': 1});
                if (ele.regular_price > 0 && ele.discount_price > 0) {
                    product_ids.push(ele.product_id);
                    product_quantities.push(ele.quantity);
                }
            });
            formData['product_id'] = product_ids;
            formData['product_quantity'] = product_quantities;
            if (this.cart_rules_free_product_id) {
                formData['cart_rules_free_product_id'] = this.cart_rules_free_product_id;
            }
            // console.log(formData);
            // return;
            this.sharedService.loadingStart();

            this.checkoutService.checkoutProcess(formData).subscribe(res => {
                this.sharedService.loadingClose(); 
                if (res && res['error']) {
                    if (res['product']) {
                        let msg = `The maximum stock quantity of <br>"${res['product']['name']}" is <h1>${res['product']['product_in']}</h1>.<br>Please decrease your quantity.`;
                        return this.sharedService.alert('Opps!', res['error'], msg, false, 'alert-warning').then(()=> {
                            this.router.navigate(['/tabs/bag']);
                        });
                    }
                    return this.sharedService.toast(res['error'], 5000, 'danger');
                }
                this.form.reset();
                this.submitted = false;
                if (formData.payment_method === 3) {
                    this.router.navigate(['/bkash-payment/' + res.order_id]);
                }
                if (formData.payment_method === 2) {
                    this.router.navigate(['/card-payment', res.order.id]);
                }

                if (formData.payment_method === 1) {
                    this.router.navigate(['/tabs/order-details', res.order_id, 1]).then(() => {
                        this.sharedService.toast(res['success'], 2000, 'success');
                    });
                }
                // for facebook pixel
                /*
                this.pixel.track('Purchase', {
                    content_ids: product_ids,
                    content_name: '',
                    content_type: 'product',
                    contents: purchaseProductContents,
                    currency: 'BDT',
                    num_items: product_ids.length,
                    value: this.grand_total
                });
                */
            }, err => {
                this.sharedService.loadingClose();
                this.submitted = false;
                this.sharedService.toast(err.error.msg ? err.error.msg : err.error.message ? err.error.message : 'please try again later.', 5000, 'danger');
            });
        }
    }


    setShippingMethod(ev: { value: any }) {
        this.calculateAssets();
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

    applyCoupon() {
        this.isFreeShipping = false;
        if (!this.form.value.coupon) {
            this.sharedService.alert('Warning!', 'Please enter your coupon code, and then press on apply', '', true, 'alert-warning');
            return false;
        }
        this.sharedService.loadingStart();
        this.userService.applyCoupon({coupon_code: this.form.value.coupon}).subscribe(resultHandler => {
            this.sharedService.loadingClose();
            if (resultHandler && !resultHandler.error) {
                this.couponData = null;
                this.couponDisText = null;
                this.couponDisAmount = null;
                this.selectedCouponId = null;
                this.checkoutService.removeCouponProduct();
                setTimeout(() => {
                    this.getCouponData({
                        coupon_id: resultHandler.coupon_id,
                        grand_total: (this.sub_total - (this.prevliilageDisAmount + (this.app_discount_amount ? this.app_discount_amount : 0))),
                        shipping_method: this.form.value.payment_method ? this.form.value.payment_method : 1
                    });
                }, 1000);
            } else {
                this.sharedService.toast(resultHandler.error, 2000, 'danger');
            }
        }, err => {
            this.sharedService.loadingClose();
            this.sharedService.toast(err.error.msg, 2000, 'danger');
        });
    }

    private getCouponData(data) {
        this.sharedService.loadingStart();
        this.userService.getCouponData(data).subscribe(resultHandler => {
            this.sharedService.loadingClose();
            if (resultHandler) {
                this.couponData = resultHandler.coupon_data;
                if (this.couponData && this.couponData.coupon_type === 'amount' && this.couponData.coupon_discount > 0) {
                    this.selectedCouponId = data.coupon_id;
                    this.sharedService.toast('Coupon added successfully!!', 2000, 'success');
                } else if (this.couponData && this.couponData.free_shipping) {
                    this.selectedCouponId = data.coupon_id;
                    this.isFreeShipping = true;
                    this.sharedService.toast('Coupon added successfully!!', 2000, 'success');
                } else if (this.couponData && this.couponData.coupon_type === 'product' && this.couponData.get_product_offer) {
                    this.selectedCouponId = data.coupon_id;
                    this.checkoutService.addItem({
                        product_id: this.couponData.product_id,
                        name: this.couponData.product_name,
                        short_desc: this.couponData.short_desc ? this.couponData.short_desc : '',
                        brand_id: this.couponData.brand_id ? this.couponData.brand_id : '',
                        brand_name: this.couponData.brand_name ? this.couponData.brand_name : '',
                        image: this.couponData.product_image ? this.couponData.product_image : '',
                        regular_price: 0,
                        discount_price: 0,
                        quantity: this.couponData.quantity ? this.couponData.quantity : 1,
                        product_in: this.couponData.product_in ? this.couponData.product_in : 1,
                        product_type: 'coupon'
                    });
                    this.sharedService.toast('Coupon added successfully!!', 2000, 'success');
                } else {
                    this.sharedService.toast('Coupon requirement failed!!', 2000, 'danger');
                }
                this.calculateAssets();
            }
        }, err => {
            this.sharedService.loadingClose();
            this.sharedService.toast(err.error.msg, 2000, 'danger');
        });
    }

    removeCoupon() {
        this.form.controls['coupon'].setValue(null);
        this.couponData = null;
        this.selectedCouponId = null;
        this.couponDisText = null;
        this.couponDisAmount = null;
        this.checkoutService.removeCouponProduct();
        this.isFreeShipping = false;
        this.calculateAssets();
    }

    getAddress() {
        this.sharedService.loadingStart();
        this.userService.getDeliveryAddress().subscribe(res => {
            this.sharedService.loadingClose();
            this.deliveryAddressList = res;
        }, err => {
            this.sharedService.loadingClose();
            this.sharedService.toast(err.error.msg, 2000, 'danger');
        });
    }

    async addAddress() {
        const addAddress = await this.modalCtrl.create({
            component: AddAddressComponent,
            componentProps: {method: 'add'}
        });
        addAddress.onDidDismiss().then(({data}) => {
            // console.log(data);
            if (data && data.length > 0) {
                this.deliveryAddressList = data;
                this.setShippingAdds(data[0]);
                this.form.patchValue({order_delivery_address: data[0].id});
            }
        })
        return await addAddress.present();
    }

    async editAddress(item) {
        const editAddressAlert = await this.alertCtrl.create({
            header: 'Confirmation',
            message: 'Are you sure you want to <b>modify</b> it?',
            buttons: [
                {text: 'Cancel', role: 'cancel'},
                {
                    text: 'Okay',
                    handler: () => {
                        this.alertCtrl.dismiss().then(() => {
                            this.editAddress_(item);
                        });
                    }
                }
            ]
        });
        return await editAddressAlert.present();
    }

    async editAddress_(_data) {
        const editAddress = await this.modalCtrl.create({
            component: AddAddressComponent,
            componentProps: {method: 'edit', data: _data}
        });
        editAddress.onDidDismiss().then((data) => {
            if (data) {
                this.getAddress();
            }
        });
        return await editAddress.present();
    }

    showMoreAddsSegment() {
        this.shippingCity = null;
        this.form.patchValue({order_delivery_address: ''});
        this.getAddress();
        if (this.form.value.order_delivery_address_check && this.form.value.order_delivery_address !== '') {
            const d = this.deliveryAddressList.filter(item => item.id === Number(this.form.value.order_delivery_address));
            if (d && d.length > 0) this.shippingCity = d[0].district;
        }
        this.calculateAssets();
    }

    setShippingAdds(item) {
        this.shippingCity = item.district;
        this.calculateAssets();
    }

    async deleteAddress(addressId) {
        const deleteAddressAlert = await this.alertCtrl.create({
            header: 'Confirmation',
            message: 'Are you sure you want to <b>delete</b> it?',
            buttons: [
                {text: 'Cancel', role: 'cancel'},
                {
                    text: 'Okay',
                    handler: () => {
                        this.alertCtrl.dismiss().then(() => {
                            this.deleteAddress_(addressId);
                        });
                    }
                }
            ]
        });
        return await deleteAddressAlert.present();
    }

    deleteAddress_(id) {
        this.userService.removeDeliveryAddress(id).subscribe(res => {
            this.sharedService.toast(res['msg'], 1000, 'success').then(() => {
                this.getAddress();
            });
        });
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
            }
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    goBack() {
        this.navCtrl.back();
    }

}