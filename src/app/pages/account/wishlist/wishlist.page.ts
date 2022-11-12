import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {SharedService} from '../../../services/shared.service';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.page.html',
    styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
    defaultImage: string = 'assets/images/no-img.jpg';
    wishList: any;
    selectItem: any;

    constructor(
        private userService: UserService,
        private sharedService: SharedService,
        public alertCtrl: AlertController
    ) {
        
    }

    ngOnInit() {
    }
    ionViewWillEnter() {
        this.getWishList();
    }

    getWishList() {
        this.sharedService.loadingStart();
        this.userService.getWishList().subscribe(result => {
            this.wishList = result;
            this.sharedService.loadingClose();
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    async deletewishList(data) {
        const changePrimaryAlert = await this.alertCtrl.create({
            header: 'Confirmation',
            message: 'Are you sure you want to add this address as primary?',
            buttons: [
                {text: 'Cancel', role: 'cancel'},
                {
                    text: 'Okay',
                    handler: () => {
                        this.alertCtrl.dismiss().then(() => {
                            this.deletewishList_(data);
                        });
                    }
                }
            ]
        });
        return await changePrimaryAlert.present();
    }
    deletewishList_(data) {
        this.userService.deleteToWishList(data).subscribe(res => {
            this.sharedService.toast(res['msg'], 1000, 'success').then(() => {
                this.getWishList();
            });
        })
    }
}
