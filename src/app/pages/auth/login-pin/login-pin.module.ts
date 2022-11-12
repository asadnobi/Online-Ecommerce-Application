import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPinPageRoutingModule } from './login-pin-routing.module';

import { LoginPinPage } from './login-pin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPinPageRoutingModule
  ],
  declarations: [LoginPinPage]
})
export class LoginPinPageModule {}
