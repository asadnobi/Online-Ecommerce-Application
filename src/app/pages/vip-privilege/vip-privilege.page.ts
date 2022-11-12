import {Component, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user.service';
import {SharedService} from 'src/app/services/shared.service';
import {HttpService} from 'src/app/services/http.service';

@Component({
    selector: 'app-vip-privilege',
    templateUrl: './vip-privilege.page.html',
    styleUrls: ['./vip-privilege.page.scss'],
})
export class VipPrivilegePage implements OnInit {
    defaultImage: string = 'assets/images/no-img.jpg';
    forWhat: string;
    privilege_data: any;
    selected_cat: number;
    selected_cat_name: string;
    trending_data: any;


    constructor(
        private httpService: HttpService,
        private userService: UserService,
        private sharedService: SharedService
    ) {

    }

    ngOnInit() {
        this.getVIPprivilege();
        this.getTrendingOffers();
    }


    getVIPprivilege() {
        this.sharedService.loadingStart();
        this.httpService.vipPrivilege().subscribe(res => {
            this.sharedService.loadingClose();
            this.privilege_data = res;
            this.selectCat(0);
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    selectCat(id?: number) {
        this.selected_cat = id;
        let div = document.querySelector('#related-cats-'+this.selected_cat);
        if(div) {
            setTimeout(()=> {
                div.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            }, 100);
        }
    }
    
    getTrendingOffers() {
        this.sharedService.loadingStart();
        this.httpService.trendingOffers().subscribe(res => {
            this.sharedService.loadingClose();
            this.trending_data = res;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

}
