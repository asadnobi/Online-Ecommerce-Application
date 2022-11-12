import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { SearchComponent } from './search.component';

const routes: Routes = [
  { path: '', component: SearchComponent}
];

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule, IonicModule, RouterModule.forChild(routes),
    FormsModule, LazyLoadImageModule
  ]
})
export class SearchModule { }
