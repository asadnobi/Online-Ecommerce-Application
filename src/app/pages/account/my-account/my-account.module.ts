import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAccountPageRoutingModule } from './my-account-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';


import { MyAccountPage } from './my-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MyAccountPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [MyAccountPage]
})
export class MyAccountPageModule {}
