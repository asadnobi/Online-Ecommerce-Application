import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteInfoPage } from './site-info.page';

const routes: Routes = [
  {
    path: '',
    component: SiteInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteInfoPageRoutingModule {}
