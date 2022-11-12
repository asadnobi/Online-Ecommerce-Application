import {AfterViewInit, Component} from '@angular/core';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import {config} from 'src/app/config';
//services
import {HttpService} from 'src/app/services/http.service';
import {StoreService} from 'src/app/services/store.service';
//components
import {StartupComponent} from 'src/app/modals/startup/startup.component';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements AfterViewInit {
    countItem: number;

    constructor(
        private platform: Platform,
        private iab: InAppBrowser,
        private readonly alertCtrl: AlertController,
        private readonly modalCtrl: ModalController,
        private httpService: HttpService,
        private storeService: StoreService
    ) {
        // open modal for sign up as a first time when app is ready
        if (!localStorage.getItem('start_up')) {
            this.opneSignUpModal();
        }
        this.storeService.cartData.subscribe(res => {
            if (Object.getOwnPropertyNames(res).length !== 0) {
                this.countItem = res.length;
            }
        });
    }
    
    ngAfterViewInit(): void {
        // this.checkAppUpdate();        
    }

    async opneSignUpModal() {
        const signUp_modal = await this.modalCtrl.create({
            component: StartupComponent
        });
        return signUp_modal.present();
    }

    checkAppUpdate() {
        this.httpService.getAppUpdate().subscribe((result: any) => {
            if (result) {
                if(this.platform.is('ios')) {
                    if (result.enable) {
                        this.openAlert(result.minorMsg['title'], result.minorMsg['msg'], result.minorMsg['button'], result.majorMsg['url']['ios']);
                    } else {
                        if (result.ios_test_version === config.app_version['ios_version'] || result.ios_version === config.app_version['ios_version']) return;
                        this.openAlert(result.majorMsg['title'], result.majorMsg['msg'], result.majorMsg['button'], result.majorMsg['url']['ios']);
                    }
                } else if(this.platform.is('android')) {
                    if (result.enable) {
                        this.openAlert(result.minorMsg['title'], result.minorMsg['msg'], result.minorMsg['button'], result.majorMsg['url']['apk']);
                    } else {
                        if (result.android_test_version === config.app_version['andriod_version'] || result.current === config.app_version['andriod_version']) return;
                        this.openAlert(result.majorMsg['title'], result.majorMsg['msg'], result.majorMsg['button'], result.majorMsg['url']['apk']);
                    }
                }
            }
        }, err => {
            this.openAlert(
                err.error.title ? err.error.title : 'Opps!!',
                err.error.msg ? err.error.msg : err.error.message ? err.error.message : 'Someting went wrong. Please try again',
                'ok'
            );
        });
    }

    async openAlert(title: string, message: string, button: string, url?: any) {
        const alert = await this.alertCtrl.create({
            backdropDismiss: false,
            keyboardClose: false,
            mode: 'ios',
            header: title,
            message: message,
            buttons: [{
                text: button,
                role: 'ok',
                handler: () => {
                    if (url) {
                        this.iab.create(url, '_system', {location: 'no'});
                    }
                }
            }]
        });
        await alert.present();
        const {role} = await alert.onDidDismiss();
        if (role === 'ok') {
            // this.checkAppUpdate();
        }
    }

}
