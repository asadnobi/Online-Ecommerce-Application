import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AlertController } from '@ionic/angular';
//services
import {UserService} from 'src/app/services/user.service';
import {SharedService} from 'src/app/services/shared.service';
import {HttpService} from 'src/app/services/http.service';

@Component({
    selector: 'app-vip-privilege-details',
    templateUrl: './vip-privilege-details.page.html',
    styleUrls: ['./vip-privilege-details.page.scss'],
})
export class VipPrivilegeDetailsPage implements OnInit {
    defaultImage: string = 'assets/images/no-img.jpg';
    dataList: any;

    constructor(private httpService: HttpService,
                private userService: UserService,
                public route: ActivatedRoute,
                private sharedService: SharedService,
                public alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.route.params.subscribe(item => {
            this.getData(item.id);
        });
    }

    getData(id) {
        this.sharedService.loadingStart();
        this.httpService.vipPrivilegeDetails(id).subscribe(res => {
            this.sharedService.loadingClose();
            // console.log(res);
            if (res) {
                this.dataList = res;
            }
        }, () => {
            this.sharedService.loadingClose();
        });
    }

    async showAlert(data: any) {
        const alert = await this.alertCtrl.create({
        //   header: data.title,
          subHeader: data.title,
          message: data.msg,
          buttons: ['OK']
        });
        await alert.present();
    }
}
