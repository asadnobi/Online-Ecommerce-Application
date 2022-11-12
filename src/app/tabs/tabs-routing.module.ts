import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
            },
            {
                path: 'browse',
                loadChildren: () => import ('../pages/browse/browse.module').then(m => m.BrowsePageModule)
            },
            {
                path: 'bag',
                loadChildren: () => import('../pages/bag/bag.module').then(m => m.BagPageModule)
            },
            {
                path: 'beautyfeed',
                loadChildren: () => import('../pages/beautyfeed/beautyfeed.module').then(m => m.BeautyfeedPageModule)
            },
            {
                path: 'account',
                loadChildren: () => import('../pages/account/account.module').then(m => m.AccountPageModule)
            },
            {
                path: 'child-category',
                loadChildren: () => import('../components/child-category/child-category.module').then(m => m.ChildCategoryModule)
            },
            {
                path: 'products',
                loadChildren: () => import('../pages/products/products.module').then(m => m.ProductsPageModule)
            },
            {
                path: 'order-details/:order_id/:pageId',
                loadChildren: () => import('../pages/account/orders/order-details/order-details.module').then(m => m.OrderDetailsPageModule)
            },
            {
                path: 'my-orders',
                loadChildren: () => import('../pages/account/orders/orders.module').then(m => m.OrdersPageModule)
            },
            {path: '', redirectTo: 'home', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
