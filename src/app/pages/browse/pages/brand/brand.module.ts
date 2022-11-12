import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
//components
import { BrandComponent } from './brand.component';
import { CommonToolbarModule } from '../../common-toolbar/common-toolbar.module';

import { FilterPipe } from 'src/app/_helpers/pipes/filter.pipe';
import { ScrollSpyDirective } from 'src/app/_helpers/directives/scroll-spy.directive';

const routes: Routes = [
  {
    path: '',
    component: BrandComponent
  }
];

@NgModule({
  declarations: [BrandComponent, FilterPipe, ScrollSpyDirective],
  imports: [
    CommonModule, IonicModule, RouterModule.forChild(routes),
    FormsModule,
    CommonToolbarModule
  ]
})
export class BrandModule { }
