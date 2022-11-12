import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicModule} from '@ionic/angular';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
// import { PixelModule, PixelService } from 'ngx-pixel';
// store module
import {StoreModule} from '@ngrx/store';
import {reducers} from './store/reducers';
//services
import {HttpService} from './services/http.service';
import {StoreService} from './services/store.service';
import {SharedService} from './services/shared.service';
import {UserService} from './services/user.service';
import {ProductService} from './services/product.service';
import {CheckoutService} from './services/checkout.service';
import { NetworkService } from './services/network.service';
// For modals
import {StartupModule} from './modals/startup/startup.module';
import {TrendDetailsModule} from './modals/trend-details/trend-details.module';
import {AddAddressModule} from './modals/add-address/add-address.module';

import {BlogDetailsModule} from './modals/blog-details/blog-details.module';
import {MallGuidesDetailsModule} from './modals/mall-guides-details/mall-guides-details.module';
import {VipPrivilegesModule} from './modals/vip-privileges/vip-privileges.module';
import {AddReviewModule} from './modals/add-review/add-review.module';
// For popovers
import {SearchModule} from './popovers/search/search.module';
import {ReviewPageMenuModule} from './popovers/review-page-menu/review-page-menu.module';
//config file
// import * as configuration from './config';
//plugin
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';

// const pixelConfig = {enabled: true, pixelId: configuration.config.pixelId};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, 
        StoreModule.forRoot(reducers),
        LazyLoadImageModule,
        // For Facebook pixel
        // PixelModule.forRoot(pixelConfig),
        // For modals
        StartupModule,
        TrendDetailsModule, AddAddressModule, BlogDetailsModule,
        MallGuidesDetailsModule, VipPrivilegesModule, AddReviewModule,
        // For popovers
        SearchModule, ReviewPageMenuModule
    ],
    providers: [
        //services
        HttpService, StoreService, SharedService, UserService, ProductService, CheckoutService, NetworkService, //PixelService,
        //plugin
        InAppBrowser, AppAvailability, Network,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
    