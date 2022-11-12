import { AfterViewInit, Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, PopoverController} from '@ionic/angular';
// import { PixelService } from 'ngx-pixel';
import SwiperCore, { Navigation } from 'swiper';
// services
import {HttpService} from 'src/app/services/http.service';
// components
import {BlogDetailsComponent} from 'src/app/modals/blog-details/blog-details.component';
import {SearchComponent} from 'src/app/popovers/search/search.component';
import {VipPrivilegesComponent} from 'src/app/modals/vip-privileges/vip-privileges.component';
import { SharedService } from 'src/app/services/shared.service';

SwiperCore.use([Navigation]);

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
    defaultImage: string = 'assets/images/no-img.jpg';
    defaultImageForProduct: string = 'https://via.placeholder.com/184x184.jpg?text=The%20MallBD';
    defaultImageForBlog: string = 'assets/images/no-image_175x228.jpg';
    notices: any //For notice
    noticesSlideOpts = {
        loop: true,
        autoplay: {delay: 2000, disableOnInteraction: false},
        direction: 'vertical',
        autoHeight: true,
        slidesPerView: 1,
        spaceBetween: 20,
    }
    //For Banner Slider______
    bannerSlides: any;
    bannerSlideOpts = {
        initialSlide: 0,
        loop: true,
        slidesPerView: 1,
        spaceBetween: 15,
        speed: 1000,
        autoplay: {delay: 4000, disableOnInteraction: false},
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        }
    };
    //For shop by products________
    skin_typeList: any;
    categoryList: any;
    back_in_stockList: any;
    brandsList: any;
    offersList: any;
    new_arrivalList: any;
    best_sellerList: any;
    baby_careList: any;
    life_styleList: any;
    exclusive_saleList: any;
    featuredList: any;
    blogList: any;
    
    isPreButton: boolean = true;
    instraWrapShow: boolean;
    
    constructor(
        public router: Router,
        public modalCtrl: ModalController,
        public popoverCtrl: PopoverController,
        private httpService: HttpService,
        private sharedService: SharedService,
        // private pixel: PixelService
    ) {
        if (localStorage.getItem('PRIVILEGES')) {
            this.isPreButton = Boolean(localStorage.getItem('PRIVILEGES'));
        }
    }

    ngOnInit() {
        // this.pixel.track('PageView');
    }

    ngAfterViewInit() {
        this.getNotices();
        this.getHomePageBanner();
        this.getHomePageData();
    }

    // Common
    pageScrolling(ev) {
        const notices = ev['srcElement'].parentElement.firstElementChild.firstElementChild;
        const lastEle = ev['srcElement'].firstElementChild.lastElementChild;
        if (ev.detail.scrollTop >= (lastEle.offsetTop - 1000)) this.instraWrapShow = true;
        if (ev.detail.scrollTop > notices.clientHeight) {
            notices.style.height = 0;
        } else {
            notices.style.removeProperty('height');
        }
    }

    getNotices() {
        this.sharedService.loadingStart();
        this.httpService.getTopNotice().subscribe(res => {
            this.sharedService.loadingClose();
            this.notices = res;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    getHomePageBanner() { // Get banner slider data
        this.sharedService.loadingStart();
        this.httpService.homePageBanner().subscribe(res => {
            this.sharedService.loadingClose();
            this.bannerSlides = res;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    selectedSlide(sliderData: any) {
        if(sliderData['module_id'] && sliderData['module_type']) {
            this.viewBannerProducts(sliderData);
        }
    }

    getHomePageData() {
        this.sharedService.loadingStart();
        this.httpService.homePageContent().subscribe(res => {
            this.sharedService.loadingClose();
            if(res) {                
                if(res.skin_types) this.skin_typeList = res.skin_types;
                if(res.category) this.categoryList = res.category;
                if(res.back_in_stock) this.back_in_stockList = res.back_in_stock;
                if(res.brand) this.brandsList = res.brand;
                if(res.offers) this.offersList = res.offers;
                if(res.new_arrival) this.new_arrivalList = res.new_arrival;
                if(res.best_seller) this.best_sellerList = res.best_seller;
                if(res.baby_care) this.baby_careList = res.baby_care;
                if(res.lifestyle) this.life_styleList = res.lifestyle;
                if(res.exclusive_sale) this.exclusive_saleList = res.exclusive_sale;
                if(res.featured) this.featuredList = res.featured;
                if(res.blogs) this.blogList = res.blogs;
            }
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }


    viewBannerProducts(item) {
        let data = {};
        if (item.module_type === 'category') {
            data = {product_browse_by: item.module_type, category_id: item.module_id, category_name: item.title};
        }
        if (item.module_type === 'brand') {
            data = {product_browse_by: item.module_type, brand_id: item.module_id, brand_name: item.title};
        }
        if (item.module_type === 'offer') {
            data = {product_browse_by: item.module_type, offer_id: item.module_id, offer_name: item.title};
        }
        this.router.navigate(['/tabs/products', data]);
    }



    selectItem(productId) {
        this.router.navigate(['/product-details', {product_id: productId}]);
    }


    async blogDetails(blogId) { // open modal for blog details
        const modal = await this.modalCtrl.create({
            component: BlogDetailsComponent,
            componentProps: {blog_id: blogId}
        });
        return await modal.present();
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

    async openVipModal(params?: string) {
        const modal = await this.modalCtrl.create({
            component: VipPrivilegesComponent,
            componentProps: {_for: params}
        });
        return await modal.present();
    }


    setPreButton() {
        this.isPreButton = false;
        localStorage.setItem('PRIVILEGES', this.isPreButton.toString());
    }

    
    selectCategory(cat) {
        if(cat.type && cat.type === 'offer') {
            this.selectOffer(cat['id'], cat['name']);
            return false;
        }
        this.selectParentCategory(cat['id'], cat['name']);
    }
    selectParentCategory(catId: number, catName: string) {
        this.router.navigate(['/tabs/products', {
            product_browse_by: 'category',
            category_id: catId,
            category_name: catName
        }]);
    }
    selectOffer(offerId: number, offerName: string) {
        this.router.navigate(['/offers'], {queryParams: {offer_id: offerId, offer_name: offerName}});
    }
    selectBrand(brand_data) {
        this.router.navigate(['/tabs/products', {
            product_browse_by: 'brand',
            brand_id: brand_data['id'],
            brand_name: brand_data['name']
        }]);
    }

    
    // doRefresh(event) {
    //     this.getNotices();
    //     this.getHomePageBanner();
    //     this.getHomePageData();
    //     setTimeout(() => {
    //         if(this.sharedService.loading.value === false) {
    //             event.target.complete();
    //         }
    //     }, 2000);
    // }
}
