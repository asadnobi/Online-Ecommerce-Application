import {Component, OnInit} from '@angular/core';
import {PopoverController, ModalController} from '@ionic/angular';
//services
import {UserService} from 'src/app/services/user.service';
import {SharedService} from 'src/app/services/shared.service';
//components
import {ReviewPageMenuComponent} from 'src/app/popovers/review-page-menu/review-page-menu.component';
import {AddReviewComponent} from 'src/app/modals/add-review/add-review.component';

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.page.html',
    styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
    defaultImage: string = 'assets/images/no-img.jpg';
    listData: any;
    products: any;
    browse_by = 'addreviews';

    constructor(private userService: UserService,
                public modalController: ModalController,
                private sharedService: SharedService,
                public popoverCtrl: PopoverController) {
    }

    ngOnInit() {
        this.getMyReviewedList();
        this.getMyUnReviewedList();
    }

    browseBy(ev: any) {
        this.browse_by = ev.detail.value;
    }

    getMyReviewedList() {
        this.sharedService.loadingStart();
        this.userService.getUserReviews().subscribe(res => {
            this.sharedService.loadingClose();
            this.listData = res;
            if (this.listData.length <= 0) {
                this.browse_by = 'unchecked';
            }
        }, err => {
            // console.log(err);
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    getMyUnReviewedList() {
        this.userService.getReviewProductList().subscribe(res => {
            this.products = res;
        }, err => {
            // console.log(err);
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    async openMenu(ev: any, id: number) {
        const popover = await this.popoverCtrl.create({
            component: ReviewPageMenuComponent,
            componentProps: {product_id: id},
            event: ev,
            mode: 'ios'
        });
        return await popover.present();
    }

    async addReview(pid) {
        const modal = await this.modalController.create({
            component: AddReviewComponent,
            componentProps: {product_id: pid}
        });
        await modal.present();

        modal.onDidDismiss().then((val) => {
            if(val.role && val.role === 'dismiss') {return false;}
            this.getMyReviewedList();
            this.getMyUnReviewedList();
        });
    }

}
