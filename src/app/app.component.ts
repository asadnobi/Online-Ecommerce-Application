import { ChangeDetectorRef, Component, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, MenuController, ModalController, IonRouterOutlet, ActionSheetController, PopoverController } from '@ionic/angular';
//plugins
import { InAppBrowser, InAppBrowserObject } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
//services
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/services/shared.service';
import { StoreService } from 'src/app/services/store.service';
import { NetworkService } from 'src/app/services/network.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  defaultImage: string = 'assets/images/no-img.jpg';
  categoryList: any;
  holidayMenu: any;
  dynamic_page_list: any;
  loading: boolean = false;

  //app button options
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  isConnected: boolean = true;

  constructor(
    private platform: Platform,
    private cdref: ChangeDetectorRef,
    public router: Router,
    @Optional() private routerOutlet: IonRouterOutlet,
    private menu: MenuController,
    private readonly modalCtrl: ModalController,
    private readonly actionCtrl: ActionSheetController,
    private readonly popoverCtrl: PopoverController,
    private inAppBrowser: InAppBrowser,
    private appAvailability: AppAvailability,
    private productService: ProductService,
    private sharedService: SharedService,
    private storeService: StoreService,
    public networkService: NetworkService
  ) {
    this.storeService.storeExistingCartData(); // restore existing cart data
    this.storeService.storeExistingLoginData(); // restore existing accepted promotion data
    this.sharedService.loading.subscribe(d => {
      this.loading = d;
      this.cdref.detectChanges();
    });
    this.initializeApp();
    this.networkSubscriber();
  }

  initializeApp() {
    if (this.platform.is('cordova') && this.platform.is('android')) {
        this.platform.backButton.subscribe(async () => {
            // close action sheet
            const action_element = await this.actionCtrl.getTop();
            if (action_element) {
                return action_element.dismiss();
            }
            // close popover
            const popover_element = await this.popoverCtrl.getTop();
            if (popover_element) {
                return popover_element.dismiss();
            }
            // close modal
            const modal_element = await this.modalCtrl.getTop();
            if (modal_element) {
                return modal_element.dismiss();
            }
            // close side menu
            const menu_element = await this.menu.getOpen();
            if (menu_element) {
                return menu_element.close();
            }
            //back route to home and then show toaster on home page for exit confirmation
            if (this.routerOutlet.canGoBack()) {
                this.routerOutlet.pop().then(() => {
                    this.routerOutlet.ngOnInit();
                });
            } else {
                if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
                    navigator['app'].exitApp();
                } else {
                    this.sharedService.toast('Press back again to exit App.', 2000, 'warning');
                    this.lastTimeBackPress = new Date().getTime();
                }
            }
        });
    }
  }

  ionViewWillEnter() {
      let pltwidth = this.platform.width();
      if(pltwidth && pltwidth > 768) {
          this.openMenu();
      }
  }


  openMenu(ev?: any) {
      if(!this.categoryList) this.getCategories();
      if(!this.holidayMenu) this.getholidayMenus();
  }

  hideMenu() {
      this.menu.close();
  }


  getCategories() {
      this.categoryList = [];
      this.productService.getCategoryList().subscribe((result: any) => {
          if(result) {
              result.forEach(item => {
                  this.categoryList.push(item);
              });
          }
      }, err => {
        //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
      });
  }

  getholidayMenus() {
      this.productService.getHolidayShopMenus().subscribe((result: any) => {
          this.holidayMenu = [];
          if(result) {
              result.forEach(item => {
                  this.holidayMenu.push(item);
              });
          }
      }, err => {
        //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
      });
  }

  selectBrand(brandId, brandName) {
      this.router.navigate(['/tabs/products', {product_browse_by: 'brand', brand_id: brandId, brand_name: brandName}]);
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
  selectSubCategory(cat: any) {
      this.sharedService.loadingStart();
      this.productService.getChildCategoryList(cat['id']).subscribe((res: any) => {
          this.sharedService.loadingClose();
          if (res && res.length > 0) {
              this.router.navigate(['/tabs/child-category'], {
                  queryParams: {
                      _list: JSON.stringify(res),
                      _list_for: JSON.stringify({category_id: cat['id'], category_name: cat['name']})
                  }
              });
          } else {
              this.selectParentCategory(cat['id'], cat['name']);
          }
      }, err => {
          this.sharedService.loadingClose();
          //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
          this.selectParentCategory(cat['id'], cat['name']);
      });
  }
  selectOffer(offerId: number, offerName: string) {
      this.router.navigate(['/offers'], {queryParams: {offer_id: offerId, offer_name: offerName}});
  }

  accordionGroup(id) {
      const content = document.getElementById('accordion_' + id) as HTMLElement;
      content.clientHeight === 0 ? content.style.height = (content.scrollHeight + 20) + 'px' : content.style.height = '0px';
      content.parentElement.classList.toggle('collapsed');
  }

    public openAppUrl(app: string, name: string, id?: string) {
        switch (app) {
            case 'facebook':
                this.launchApp(
                'fb://', 'com.facebook.katana',
                'fb://profile/' + id,
                'fb://page/' + id,
                'https://www.facebook.com/' + name);
                break;
            case 'instagram':
                this.launchApp(
                'instagram://',
                'com.instagram.android',
                'instagram://user?username=' + name,
                'instagram://user?username=' + name,
                'https://www.instagram.com/' + name);
                break;
            case 'twitter':
                this.launchApp(
                'twitter://', 'com.twitter.android',
                'twitter://user?screen_name=' + name,
                'twitter://user?screen_name=' + name,
                'https://twitter.com/' + name);
                break;
            default:
                break;
        }
    }

    private launchApp(iosApp: string, androidApp: string, appUrlIOS: string, appUrlAndroid: string, webUrl: string) {
        let app: string;
        let appUrl: string;
        // check if the platform is ios or android, else open the web url
        if (this.platform.is('ios')) {
        app = iosApp;
        appUrl = appUrlIOS;
        } else if (this.platform.is('android')) {
        app = androidApp;
        appUrl = appUrlAndroid;
        } else {
        const browser: InAppBrowserObject = this.inAppBrowser.create(webUrl, '_system');
        return;
        }
        this.appAvailability.check(app).then(
            () => {
                // success callback, the app exists and we can open it
                const browser: InAppBrowserObject = this.inAppBrowser.create(appUrl, '_system');
            },
            () => {
                // error callback, the app does not exist, open regular web url instead
                const browser: InAppBrowserObject = this.inAppBrowser.create(webUrl, '_system');
            }
        );
    }

    networkSubscriber(): void {
        this.networkService.getNetworkStatus().pipe(debounceTime(300)).subscribe((connected: boolean) => {
            // console.log('[Home] isConnected', connected);
            this.isConnected = connected;
        });
    }


}
