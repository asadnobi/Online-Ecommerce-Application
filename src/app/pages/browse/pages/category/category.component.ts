import { Component, OnInit, ViewChild } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { IonSlides } from '@ionic/angular';
//services
import {ProductService} from 'src/app/services/product.service';
import {SharedService} from 'src/app/services/shared.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  defaultImage: string = 'assets/images/no-img.jpg';
  categories: any;
  categoryList: any;
  cat_by: string;
  category_id: number;
  catSlideOpts: any;
  categorySearchResult: any;
    
  @ViewChild('slides', {static: false}) slides: IonSlides;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private productService: ProductService,
    private sharedService: SharedService
  ) {    
    this.catSlideOpts = {setWrapperSize: true, width: 300, spaceBetween: 20};
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.sharedService.loadingStart();
    this.productService.getCategoryList().subscribe(res => {
        this.sharedService.loadingClose();
        this.categories = res;
        this.categoryList = res;
        this.cat_by = res[0].slug;
        setTimeout(() => {
            if (!this.category_id) {
                this.category_id = res[0].id;
                this.selectGroup();
            } else {
                this.selectGroup(this.category_id);
            }
        }, 10);
    }, err => {
        this.sharedService.loadingClose();
        //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
    });
  }

  slideChange(ev: any) {
    this.slides.getActiveIndex().then((index: number) => {
        if(!index || !this.categoryList || !this.categoryList[index] || !this.categoryList[index].id) {return;}
        this.selectGroup(this.categoryList[index].id);
    });
  }

  selectGroup(categoryId?: number) {
    if (categoryId) {
        this.category_id = categoryId;
        const listIndex = this.categoryList.findIndex(item => item.id === categoryId);
        if(listIndex && listIndex !== -1) {this.slides.slideTo(listIndex, 1000)}
    }
    const all_list = document.querySelectorAll('.list');
    all_list.forEach(item => {
        item.classList.add('ion-hide')
    });
    if (this.category_id) {
        const content = document.getElementById('list_' + this.category_id);
        if(content) content.classList.remove('ion-hide');
    }
  }

  selectCategory(cat: any) {
    if(cat.type && cat.type === 'offer') {
        this.selectOffer(cat['id'], cat['name']);
        return false;
    }
    this.selectParentCategory(cat['id'], cat['name']);
  }
  selectParentCategory(catId: number, catName: string) {
      this.router.navigate(['/tabs/products', {
          product_browse_by: 'category',
          category_id: catId,
          category_name: catName
      }]);
  }
  selectSubCategory(cat: any) {
    this.sharedService.loadingStart();
    this.productService.getChildCategoryList(cat['id']).subscribe((res: any) => {
        this.sharedService.loadingClose();
        if (res && res.length > 0) {
            this.router.navigate(['/tabs/child-category'], {
                queryParams: {
                    _list: JSON.stringify(res),
                    _list_for: JSON.stringify({category_id: cat['id'], category_name: cat['name']})
                }
            });
        } else {
            this.selectParentCategory(cat['id'], cat['name']);
        }
    }, err => {
        this.sharedService.loadingClose();
        //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        this.selectParentCategory(cat['id'], cat['name']);
    });
  }
  
  selectOffer(offerId: number, offerName: string) {
    this.router.navigate(['/offers'], {queryParams: {offer_id: offerId, offer_name: offerName}});
  }

}
