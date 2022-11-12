import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import {SharedService} from 'src/app/services/shared.service';
import { ProductService } from '../../services/product.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  defaultImage: string = 'assets/images/no-img.jpg';
  offer_id: number;
  offer_name: string;
  data: any;

  listData: any;
  listDataTotal: number;
  page: number;
  isScollTopBarShow: boolean;

  @ViewChild(IonContent, {static: true}) content: IonContent;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private httpService: HttpService,
    private productService: ProductService,
    private sharedService: SharedService
  ) {
    
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(state => {
      if (state && state.get('offer_id')) {
        this.offer_id = Number(state.get('offer_id'));
        this.offer_name = state.get('offer_name');
      }
    });
    if(this.offer_id) {
      this.getChildOffer();
      this.getOfferProduct();
    }
  }

  ngOnDestroy() {
    this.page = undefined;
  }
  
  getChildOffer() {
    this.httpService.getSpecialChildoffer(this.offer_id).subscribe(res => {
      if(res) {
        this.data = res;
      }
    }, err => {
      //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
    });
  }

  getOfferProduct(event?) {
    this.productService.getOfferProducts(this.offer_id, this.page).subscribe(res => {
      this.sharedService.loadingClose();
      if (!this.listData) {
          this.listData = res['data'];
          this.listDataTotal = res['total'];
      } else {
          res['data'].forEach(item => {
              this.listData.push(item);
          });
      }
      this.page = res['current_page'] + 1;
      if (event) {
          event.target.complete();
      }
    }, err => {
        this.sharedService.loadingClose();
        //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
    });
  }

  loadMoreData(event) {
    this.getOfferProduct(event);
    if (this.listData && (this.listData.length === this.listDataTotal)) {
        event.target.disabled = true;
    }
  }

  brandsProducts(data) {
    this.router.navigate([
      '/tabs/products', {
        product_browse_by: 'special_offers',
        offer_id: data['offer_id'],
        brand_id: data['brand_id'],
        brand_name: data['brand_name']
      }
    ]);
  }

  categoryProducts(data) {
    this.router.navigate([
      '/tabs/products', {
        product_browse_by: 'special_offers',
        offer_id: data['offer_id'],
        category_id: data['category_id'],
        category_name: data['category_name']
      }
    ]);
  }

  product_details(product_id) {
    this.router.navigate(['/product-details', product_id]);
  }
  
  pageScrolling(ev) {
    if (ev.detail.scrollTop >= 2500) {
        this.isScollTopBarShow = true;
    } else {
        this.isScollTopBarShow = false;
    }
  }

  scrollToTop() {
    this.content.scrollToTop(400);
  }

}
