import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
//services
import {ProductService} from 'src/app/services/product.service';
import {SharedService} from 'src/app/services/shared.service';

@Component({
    selector: 'app-offer',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.scss'],
})
export class OfferComponent {
    defaultImage: string = 'assets/images/no-img.jpg';
    offerList: any;

    constructor(public router: Router,
                private productService: ProductService,
                private sharedService: SharedService,
                public cdref: ChangeDetectorRef) {
    }

    ionViewDidEnter() {
        this.getOfferList();
    }


    getOfferList() {
       this.sharedService.loadingStart();
        this.productService.getOfferList().subscribe(result => {
           this.sharedService.loadingClose();
            this.offerList = result;
        }, err => {
           this.sharedService.loadingClose();
           //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    navigateByOffer(offerId, offerName) {
        this.productService.setRedirectPage('/tabs/browse');
        this.router.navigate(['/tabs/products', {
            product_browse_by: 'offer',
            offer_id: offerId,
            offer_name: offerName
        }]);
    }
}
