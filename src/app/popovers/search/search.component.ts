import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {PopoverController, IonSearchbar} from '@ionic/angular';
// import { PixelService } from 'ngx-pixel';
import { config } from 'src/app/config';
//services
import {ProductService} from 'src/app/services/product.service';

import algoliasearch from 'algoliasearch';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    defaultImage: string = 'assets/images/no-img.jpg';
    listData: any;
    listDataTotal: number;
    page: number;
    searchText: string;
    searchbar: any;

    searchProductIds: any = [];
    searchProductContents: any = [];

    searchType: string;
    client: any;
    algoliaSearchIndex: any;

    @ViewChild(IonSearchbar) search: IonSearchbar;

    constructor(
        private productService: ProductService,
        public router: Router,
        public popoverCtrl: PopoverController,
        // private pixel: PixelService
    ) {

    }

    ngOnInit() {
        this.checkSearchType();
    }

    checkSearchType() {
        this.productService.checkSearchType().subscribe(res => {
            if(res) {
                this.searchType = res['search_type'];
                this.client = algoliasearch(res['algolia_app_id'], res['algolia_secret']);
                this.algoliaSearchIndex = this.client.initIndex('products');
            }
        }, err => {

        });
    }

    ionViewDidEnter() {
        setTimeout(() => {
            this.search.setFocus();
        }, 500);
    }

    searchProductText(ev: any) {
        if(!ev) return;
        let search_string = ev.detail['value'];
        this.searchText = search_string;
        if(this.searchType === 'algolia') {
            this.algoliaSearchIndex.search(search_string, {
                hitsPerPage: 10
            }).then(({ hits, nbHits }) => {
                this.listData = hits;
                this.listDataTotal = nbHits;
            }).catch(err => {
                this.listData = null;
            });
        } else {
            if(search_string.length <= 0) return;
            this.regularSearch();
        }
    }

    regularSearch() {
        this.productService.searchProductsOnEnter(this.searchText, this.page).subscribe(res => {
            if(res && res['data']) {
                this.listData = res['data'];
                this.listDataTotal = res['total'];

                // for facebook pixel
                // if(res['data'].length > 0) {
                //     res['data'].forEach(item => {
                //         this.searchProductIds.push(item['product_id']);
                //         this.searchProductContents.push({'id': item['name'], 'quantity': 1});
                //     });
                // }
            } else {
                this.listData = [];
            }
            // this.pixel.track('Search', {
            //     content_category: 'product search',
            //     content_ids: this.searchProductIds,
            //     contents: this.searchProductContents,
            //     currency: 'BDT',
            //     search_string: this.searchText
            // });
        }, err => {
            this.listData = null;
        });
    }


    searchProductbyEnter() {
        if(!this.searchText || this.searchText.length <= 0) return;
        this.popoverCtrl.dismiss();
        this.router.navigate(['/tabs/products', {product_browse_by: 'search', search_text: this.searchText}]);
        this.productService.setRedirectPage('/tabs/home');
    }


    productDetails(id) {
        this.router.navigate([`/product-details/${id}`]);
        this.popoverCtrl.dismiss();
    }

}
