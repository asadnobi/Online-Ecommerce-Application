import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavController, AlertController, IonSlides, ModalController, IonContent, PopoverController} from '@ionic/angular';
// import { PixelService } from 'ngx-pixel';
//plugin
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
//services
import {ProductService} from 'src/app/services/product.service';
import {CheckoutService} from 'src/app/services/checkout.service';
import {UserService} from 'src/app/services/user.service';
import {SharedService} from 'src/app/services/shared.service';
//components
import {AddReviewComponent} from 'src/app/modals/add-review/add-review.component';
import {SearchComponent} from 'src/app/popovers/search/search.component';
import { StoreService } from 'src/app/services/store.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.page.html',
    styleUrls: ['./product-details.page.scss'],
})

export class ProductDetailsPage implements OnInit, OnDestroy {
    defaultImage: string = 'assets/images/no-img.jpg';
    countItem: number;
    productId: any;
    details: any;
    videos: any;
    howToUse: any;
    ingredients: any;
    reviewList: any;
    total_rating: number;
    itemQuantity: number;
    current_tab: string = 'details-tab';
    learnMoreData: any;
    relatedData: any;
    wishList: any;
    isLoggedUser: boolean;
    @ViewChild(IonContent, {static: true}) content: IonContent;
    @ViewChild('mySlider', {static: true}) slides: IonSlides;
    @ViewChild('reviewspanel', {static: false}) rvPanel: ElementRef;

    grpData: any;
    colors: any;
    sizes: any;
    selectedColors: number;
    selectedSize: number;
    variable_image: any;

    constructor(
        public route: ActivatedRoute,
        private navCtrl: NavController,
        private productService: ProductService,
        private checkout: CheckoutService,
        private userService: UserService,
        public modalController: ModalController,
        private socialSharing: SocialSharing,
        private sharedService: SharedService,
        public alertCtrl: AlertController,
        public popoverCtrl: PopoverController,
        public router: Router,
        // private pixel: PixelService,
        private storeService: StoreService
    ) {
        this.storeService.user.subscribe(res => {
            if (res['isLogged']) {
                this.isLoggedUser = true;
            }
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.resetPreviousData();
            this.productId = params['product_id'];
            this.getProductDetails();
            this.tabChanged();
            this.getUserWishList();
        });
    }


    ngOnDestroy() {
        this.resetPreviousData();
    }

    goBack() {
        this.navCtrl.back();
    }

    tabChanged(ev?) {
        if (ev) {
            this.current_tab = ev.detail.value;
        }
        if (this.current_tab === 'details-tab') {
            this.getHowToUse();
            this.getProductsLearnMoreVideos();
        } else if (this.current_tab === 'video-tab') {
            this.getProductVideo();
        } else if (this.current_tab === 'review-tab') {
            this.getProductReview();
        }
    }

    slideNext() {
        this.slides.slideNext();
    }

    slidePrev() {
        this.slides.slidePrev();
    }

    getProductDetails() {
        this.sharedService.loadingStart();
        this.productService.getSingleProductDetails(this.productId).subscribe((res: any) => {
            this.sharedService.loadingClose();
            this.details = res[0];
            this.itemQuantity = 1;
            if (this.details['group_id'] && this.details['group_id'] > 0) {
                this.getGroupsData(this.details['group_id']);
            }
            this.getRelatedProducts();
            if(this.details) {
                /*this.pixel.track('ViewContent', {
                    content_ids: [this.details['product_id']],
                    content_category: 'page',
                    content_name: this.details['name'],
                    content_type: 'product',
                    contents: [{'id': this.details['product_id'], 'quantity': 1}],
                    currency: 'BDT',
                    value: (this.details['discount_price'] && (this.details['discount_price'] !== this.details['regular_price'])) ? this.details['discount_price'] : this.details['regular_price']
                });*/
            }
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    getProductVideo() {
        this.sharedService.loadingStart();
        this.productService.getSingleProductVideo(this.productId).subscribe((res: any) => {
            this.sharedService.loadingClose();
            this.videos = res;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    getHowToUse() {
        this.productService.getSingleProductUse(this.productId).subscribe((res: any) => {
            this.howToUse = res.how_to_use;
            this.ingredients = res.description;
        });
    }

    getProductReview() {
        let total = 0;
        this.sharedService.loadingStart();
        this.productService.getSingleProductReview(this.productId).subscribe((res: any) => {
            this.sharedService.loadingClose();
            this.reviewList = res;
            res.forEach(item => {
                total = total + item['rating'];
            });
            this.total_rating = Number((total / res.length).toFixed(1));
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }


    addToCart() {
        let item = this.details;
        if ((this.colors && this.colors.length > 0) && !this.selectedColors) {
            this.sharedService.alert('Warning!', null, 'Please select a color');
            return false;
        }
        if ((this.sizes && this.sizes.length > 0) && !this.selectedSize) {
            this.sharedService.alert('Warning!', null, 'Please select a size');
            return false;
        }
        if (this.itemQuantity > item.product_in) {
            this.sharedService.alert('Warning!', null, 'Quantity out of stock, Please select maximum quantity of' + item.product_in);
            return false;
        }        
        item.quantity = this.itemQuantity;
        this.checkout.addItem(item).then(async () => {
            const alert = await this.alertCtrl.create({
                header: 'Confirm!',
                message: 'Item added successfully!',
                backdropDismiss: false,
                mode: 'ios',
                buttons: [{
                    text: 'View Basket',
                    cssClass: 'primary',
                    role: 'cancel'
                }, {
                    text: 'Continue shopping',
                    cssClass: 'secondary',
                }]
            });
            await alert.present();
            const { role } = await alert.onDidDismiss();
            if(role && role === 'cancel') {
                this.router.navigate(['/tabs/bag']).then(()=> {
                    window.scroll(0, 0);
                })
            }
            /*----- Facebook Pixel for AddToCart -----*/
            /*this.pixel.track('AddToCart', {
                content_ids: [item['product_id']],
                content_name: item['name'],
                content_type: 'product',
                contents: [{'id': item['product_id'], 'quantity': item['quantity']}],
                currency: 'BDT',
                value: (item['discount_price'] && (item['discount_price'] !== item['regular_price'])) ? item['discount_price'] : item['regular_price']
            });*/
        });
    }

    increase() {
        let stock_available = this.details.product_in ? this.details.product_in : 0;
        if (this.itemQuantity < stock_available) {
            this.itemQuantity++;
        } else {
            this.sharedService.alert('Warning!', null, 'The requested quantity is not available', false, 'alert-warning');
        }
    }

    decrease() {
        if (this.itemQuantity > 1) {
            this.itemQuantity--;
        } else {
            this.sharedService.alert('Warning!', null, 'Minimum selection 1', false);
            this.itemQuantity = 1;
        }
    }

    getProductsLearnMoreVideos() {
        this.sharedService.loadingStart();
        this.productService.getProductsLearnMoreVideos(this.productId).subscribe(item => {
            this.sharedService.loadingClose();
            this.learnMoreData = item.video_link;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    getRelatedProducts() {
        this.productService.getRelatedProducts(this.productId).subscribe(items => {
            this.relatedData = items;
            // setTimeout(() => {
            //     $e.target.complete();
            // }, 2000);
        });
    }

    async addReview() {
        if (this.isLoggedUser) {
            const modal = await this.modalController.create({
                component: AddReviewComponent,
                componentProps: {product_id: this.details.product_id}
            });
            await modal.present();

            modal.onDidDismiss().then(() => {
                this.getProductReview();
            });
        } else {
            this.signInConfirmation('review');
        }
    }


    productShare(item) {
        // console.log(item);
        const options = {
            message: item.name,
            url: 'https://themallbd.com',
            files: item.image
        }
        this.socialSharing.shareWithOptions(options).then(() => {
        }).catch((err) => {
            // Error!
            console.log(err);
        });
    }

    getUserWishList() {
        if (this.isLoggedUser) {
            this.sharedService.loadingStart();
            this.userService.getWishList().subscribe(result => {
                this.sharedService.loadingClose();
                this.wishList = result;
            }, err => {
                this.sharedService.loadingClose();
            });
        }
    }

    addToWishList() {
        let data = {product_id: this.details.product_id};
        if (this.isLoggedUser) {
            this.sharedService.loadingStart();
            this.userService.addToWishList(data).subscribe(result => {
                this.sharedService.loadingClose();
                this.sharedService.toast('Thank you! item has been added to your wish list.', 1000, 'success').then(() => {
                    this.getUserWishList();
                });
                /*this.pixel.track('AddToWishlist', {
                    content_name: this.details['name'],
                    content_category: 'product',
                    content_ids: [this.details['product_id']],
                    contents: [{'id': this.details['product_id'], 'quantity': 1}],
                    currency: 'BDT',
                    value: (this.details['discount_price'] && (this.details['discount_price'] !== this.details['regular_price'])) ? this.details['discount_price'] : this.details['regular_price']
                });*/
            }, err => {
                this.sharedService.loadingClose();
                //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
            });
        } else {
            this.signInConfirmation('wish-list');
        }
    }

    removeToWishList() {
        this.sharedService.loadingStart();
        this.userService.deleteToWishList(this.details.product_id).subscribe(result => {
            this.sharedService.loadingClose();
            this.sharedService.toast('Thank you! item has been added to your wish list.', 1000, 'success').then(() => {
                this.getUserWishList();
            });
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }


    async signInConfirmation(msgFor?: string) {
        let msg;
        if (msgFor === 'wish-list') {
            msg = 'You have to need "Sign In" for add this item to your wish list.';
        } else if (msgFor === 'review') {
            msg = 'You have to need "Sign In" for add review.';
        }
        const alert = await this.alertCtrl.create({
            header: 'Please Confirm!',
            message: msg,
            backdropDismiss: false,
            mode: 'ios',
            buttons: [
                {text: 'Cancel', role: 'cancel', cssClass: 'primary'},
                {
                    text: 'Continue SignIn', cssClass: 'secondary',
                    handler: () => {
                        this.router.navigate(['/auth/sign-in']);
                    }
                }
            ]
        });
        await alert.present();

        alert.onDidDismiss().then((data) => {
            if (!data.role) {
                sessionStorage.setItem('route', '/product-details/' + this.details.product_id);
            }
        });
    }

    relatedProductDetails(productId) {
        this.router.navigate(['/product-details', productId]);
        // await this.resetPreviousData();
        // this.productId = productId;
        // this.getProductDetails();
        // this.content.scrollToTop();
    }

    resetPreviousData() {
        this.countItem = 0;
        this.productId = undefined;
        this.details = undefined;
        this.videos = undefined;
        this.howToUse = undefined;
        this.ingredients = undefined;
        this.reviewList = undefined;
        this.total_rating = undefined;
        this.itemQuantity = undefined;
        this.current_tab = 'details-tab';
        this.learnMoreData = undefined;
        this.relatedData = undefined;
        this.wishList = undefined;
        this.isLoggedUser = undefined;

        this.grpData = undefined;
        this.colors = undefined;
        this.sizes = undefined;
        this.selectedColors = undefined;
        this.selectedSize = undefined;
        this.variable_image = undefined;
    }

    getGroupsData(groupId) {
        this.colors = [];
        this.sizes = [];
        this.sharedService.loadingStart();
        this.productService.getProductsGrpIdData(groupId).subscribe((result: any) => {
            this.sharedService.loadingClose();
            this.grpData = result;
            if (this.grpData && this.grpData.length > 0) {
                for (let i = 0; i < this.grpData.length; i++) {
                    const sameColorIndex = this.colors.findIndex(c => c.id === this.grpData[i].colour_id);
                    const sameSizeIndex = this.sizes.findIndex(s => s.id === this.grpData[i].size_id);
                    if (sameColorIndex > -1) {
                        //nothing.....
                    } else {
                        this.colors.push({
                            colour_code: this.grpData[i].colour.colour_code,
                            name: this.grpData[i].colour.name,
                            id: this.grpData[i].colour.id
                        })
                    }
                    if (sameSizeIndex > -1) {
                        //nothing.....
                    } else {
                        if (this.grpData[i].size_id && this.grpData[i].size) {
                            this.sizes.push({
                                origin: this.grpData[i].size.origin,
                                name: this.grpData[i].size.name,
                                id: this.grpData[i].size.id
                            })
                        }
                    }
                }
            }
            //------if want to default select color and size------
            this.selectedColors = this.colors.length > 0 ? this.colors[0].id : null;
            this.selectedSize = this.sizes.length > 0 ? this.sizes[this.sizes.length - 1].id : null;            
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    findMatchItemData() {
        let filters = {};
        if (this.selectedColors) filters['colour_id'] = this.selectedColors;
        if (this.selectedSize) filters['size_id'] = this.selectedSize;
        let _findMatchItemData = this.grpData.filter(obj => {
            return Object.keys(filters).every(filter => {
                return filters[filter] === obj[filter]
            });
        });
        this.details.product_id = _findMatchItemData[0].product_id;
        this.details.name = _findMatchItemData[0].name ? _findMatchItemData[0].name : null;
        this.details.regular_price = _findMatchItemData[0].regular_price ? _findMatchItemData[0].regular_price : null;
        this.details.discount_price = _findMatchItemData[0].discount_price ? _findMatchItemData[0].discount_price : null;
        this.details.product_in = _findMatchItemData[0].product_in ? _findMatchItemData[0].product_in : null;
        this.details.colour_id = _findMatchItemData[0].colour_id ? _findMatchItemData[0].colour_id : null;
        this.details.colour = _findMatchItemData[0].colour ? _findMatchItemData[0].colour : null;
        this.details.size_id = _findMatchItemData[0].size_id ? _findMatchItemData[0].size_id : null;
        this.details.size = _findMatchItemData[0].size ? _findMatchItemData[0].size : null;

        this.itemQuantity = 1;
        /*this.pixel.track('CustomizeProduct', {
            content_ids: [this.details['product_id']],
            content_name: this.details['name'],
            content_type: 'product',
            content_category: 'product',
            contents: [{
                'id': this.details['product_id'],
                'quantity': 1,
                'size': this.details['size'] ? this.details['size']['name'] : null,
                'color': this.details['colour'] ? this.details['colour']['name'] : null
            }],
            currency: 'BDT',
            value: (this.details['discount_price'] && (this.details['discount_price'] !== this.details['regular_price'])) ? this.details['discount_price'] : this.details['regular_price']
        });*/
    }

    changeColor(ev: any) {
        if (ev && ev.detail.value) {
            this.selectedColors = ev.detail.value;
        }
        this.sizes = [];
        if (this.grpData && this.grpData.length > 0) {
            const findMatchSizeForcolor = this.grpData.filter(obj => obj['colour_id'] === this.selectedColors);
            if (findMatchSizeForcolor && findMatchSizeForcolor.length > 0) {
                findMatchSizeForcolor.forEach(obj => {
                    if (obj.size_id && obj.size) {
                        this.sizes.push({origin: obj.size.origin, name: obj.size.name, id: obj.size.id})
                    }
                });
            }
            this.selectedSize = this.sizes.length > 0 ? this.sizes[this.sizes.length - 1].id : null;
        }
        this.getVariableImage();
        this.findMatchItemData();
    }

    changeSize(ev: any) {
        if (ev && ev.detail.value) {
            this.selectedSize = ev.detail.value;
        }
        this.findMatchItemData();
    }

    getVariableImage() {
        if (this.selectedColors) {
            let selectedAllColorImageIndex = this.grpData.filter(c => c.colour_id === this.selectedColors);
            if (selectedAllColorImageIndex && selectedAllColorImageIndex.length > 0) {
                this.variable_image = [];
            }
            selectedAllColorImageIndex.forEach(obj => {
                this.variable_image.push(obj['image']);
            });
        }
    }

    scrollToReviewSection() {
        this.current_tab = 'review-tab';
        this.tabChanged(); 
        let interval = setInterval(() => {
            if(this.rvPanel) {clearInterval(interval);}
            if(this.rvPanel) {
                const scrollElement = this.rvPanel.nativeElement as HTMLElement;
                const scrollY = Number (Number(scrollElement.parentElement.offsetTop) - 25);
                this.content.scrollToPoint(0, scrollY, 1000);
            }
        }, 100);
    }

    async openSearchbar(ev: any) {
        const searchbar = await this.popoverCtrl.create({
            component: SearchComponent,
            event: ev,
            translucent: true,
            mode: 'ios',
            cssClass: 'full-width-popover-dark-opacity'
        });

        return await searchbar.present();
    }


    addItem(item: any, _for?: string) {
        const singleItem = {
            product_id: item.product_id,
            name: item.name,
            short_desc: item.short_desc ? item.short_desc : '',
            brand_id: item.brand_id ? item.brand_id : '',
            brand_name: item.brand_name ? item.brand_name : '',
            image: item.image ? item.image : '',
            regular_price: item.regular_price,
            discount_price: item.discount_price,
            quantity: item.quantity,
            product_in: item.product_in ? item.product_in : '',
            product_type: item.product_type ? item.product_type : 'regular'
        };
        if(item['colour']) singleItem['colour'] = {name: item['colour'].name, colour_code: item['colour'].colour_code, id: item['colour'].id};
        if(item['size']) singleItem['size'] = {name: item['size'].name, origin:  item['size'].origin, id: item['size'].id};
        return new Promise<void>((resolve, reject) => {
            
        });        
    }
    


}