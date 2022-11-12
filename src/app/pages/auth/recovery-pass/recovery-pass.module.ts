import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RecoveryPassPageRoutingModule } from './recovery-pass-routing.module';
import { RecoveryPassPage } from './recovery-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RecoveryPassPageRoutingModule
  ],
  declarations: [RecoveryPassPage]
})
export class RecoveryPassPageModule {}
