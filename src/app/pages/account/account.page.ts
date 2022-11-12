import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {VipPrivilegesComponent} from 'src/app/modals/vip-privileges/vip-privileges.component';
import { StoreService } from 'src/app/services/store.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
})
export class AccountPage {
    userData: any;

    constructor(
        public router: Router,
        public modalCtrl: ModalController,
        private storeService: StoreService
    ) {
    }

    ionViewDidEnter() {
        this.storeService.user.subscribe(res => {
            if (Object.getOwnPropertyNames(res).length !== 0) {
                if (res['isLogged']) {
                    this.userData = res['data'];
                } else {
                    this.router.navigate(['/auth']);
                }
            }
        });
    }


    async openVipModal(params?: string) {
        const modal = await this.modalCtrl.create({
            component: VipPrivilegesComponent,
            componentProps: {_for: params}
        });
        return await modal.present();
    }

    logout() {
        this.storeService.saveLoginData({ isLogged: false });
    }

}
