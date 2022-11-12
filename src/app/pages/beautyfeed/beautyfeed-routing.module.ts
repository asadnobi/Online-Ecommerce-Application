import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeautyfeedPage } from './beautyfeed.page';

const routes: Routes = [
  {
    path: '',
    component: BeautyfeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeautyfeedPageRoutingModule {}
