import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'category',
    loadChildren: () => import('./pages/category/category.module').then(m => m.CategoryModule)
  },
  {
    path: 'brand',
    loadChildren: () => import('./pages/brand/brand.module').then(m => m.BrandModule)
  },
  {
    path: 'offer',
    loadChildren: () => import('./pages/offer/offer.module').then(m => m.OfferModule)
  },
  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule, IonicModule, RouterModule.forChild(routes)
  ]
})
export class BrowsePageModule {}
