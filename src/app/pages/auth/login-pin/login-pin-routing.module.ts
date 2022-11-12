import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPinPage } from './login-pin.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPinPageRoutingModule {}
