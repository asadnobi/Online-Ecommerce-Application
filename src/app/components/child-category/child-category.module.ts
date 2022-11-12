import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { ChildCategoryComponent } from './child-category.component';

const routes: Routes = [
  { path: '', component: ChildCategoryComponent}
]

@NgModule({
  declarations: [ChildCategoryComponent],
  imports: [
    CommonModule, IonicModule, RouterModule.forChild(routes)
  ]
})
export class ChildCategoryModule { }
