import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VipPrivilegeDetailsPage } from './vip-privilege-details.page';

const routes: Routes = [
  {
    path: '',
    component: VipPrivilegeDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VipPrivilegeDetailsPageRoutingModule {}
