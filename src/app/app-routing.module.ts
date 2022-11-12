import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'tabs', pathMatch: 'full'},
    {path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)},
    {path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)},
    {
        path: 'my-account',
        loadChildren: () => import('./pages/account/my-account/my-account.module').then(m => m.MyAccountPageModule)
    },
    {
        path: 'need-help',
        loadChildren: () => import('./pages/account/need-help/need-help.module').then(m => m.NeedHelpPageModule)
    },
    {
        path: 'notification',
        loadChildren: () => import('./pages/account/notification/notification.module').then(m => m.NotificationPageModule)
    },
    {
        path: 'my-reviews',
        loadChildren: () => import('./pages/account/reviews/reviews.module').then(m => m.ReviewsPageModule)
    },
    {
        path: 'wish-list',
        loadChildren: () => import('./pages/account/wishlist/wishlist.module').then(m => m.WishlistPageModule)
    },
    {
        path: 'pages',
        loadChildren: () => import('./pages/site-info/site-info.module').then(m => m.SiteInfoPageModule)
    },
    {
        path: 'products',
        loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule)
    },
    {
        path: 'product-details/:product_id',
        loadChildren: () => import('./pages/products/product-details/product-details.module').then(m => m.ProductDetailsPageModule)
    },
    {
        path: 'child-category',
        loadChildren: () => import('./components/child-category/child-category.module').then(m => m.ChildCategoryModule)
    },
    {
        path: 'checkout',
        loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule)
    },
    {
        path: 'bkash-payment/:order_id',
        loadChildren: () => import('./pages/bkash-payment/bkash-payment.module').then(m => m.BkashPaymentPageModule)
    },
    {
        path: 'card-payment/:order_id',
        loadChildren: () => import('./pages/card-payment/card-payment.module').then(m => m.CardPaymentPageModule)
    },
    {
        path: 'vip-privilege-details/:id',
        loadChildren: () => import('./pages/vip-privilege-details/vip-privilege-details.module').then(m => m.VipPrivilegeDetailsPageModule)
    },
    {
        path: 'vip-privilege',
        loadChildren: () => import('./pages/vip-privilege/vip-privilege.module').then(m => m.VipPrivilegePageModule)
    },
    {
        path: 'offers',
        loadChildren: () => import('./pages/offers/offers.module').then( m => m.OffersPageModule)
    }

];
@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
