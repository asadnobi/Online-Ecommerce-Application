import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {AddReviewModule} from '../../../modals/add-review/add-review.module';
/*import { AddReviewComponent } from '../../../modals/add-review/add-review.component';*/
import {ReviewsPageRoutingModule} from './reviews-routing.module';

import {ReviewsPage} from './reviews.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule, LazyLoadImageModule,
        ReviewsPageRoutingModule
    ],
    declarations: [ReviewsPage]
})
export class ReviewsPageModule {
}
