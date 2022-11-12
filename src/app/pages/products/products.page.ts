import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {IonContent, NavController} from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
//services
import {ProductService} from 'src/app/services/product.service';
import {SharedService} from 'src/app/services/shared.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {
    defaultImage: string = 'assets/images/no-img.jpg';
    browse_by: string;
    category_id: number;
    category_name: string;
    brand_id: number;
    brand_name: string;
    offer_id: number;
    offer_name: string;
    trending_id: number;
    trending_name: string;
    skin_type: string;
    listData: any;
    listDataTotal: number;
    page: number;
    isScollTopBarShow: boolean;
    search_text: string;
    gift_id: number;
    gift_name: string;

    filterList: any;
    skinArray: any = [
        {id: 1, value: 'oily', label: 'Oily'},
        {id: 2, value: 'dry', label: 'Dry'},
        {id: 3, value: 'combination', label: 'Combination'},
        {id: 4, value: 'normal', label: 'Normal'},
        {id: 5, value: 'sensitive', label: 'Sensitive'}
    ];
    brandList: any;
    categoryList: any;
    sortByArray: any = [
        // {id: 1, value: 'featured', label: 'Featured'},
        // {id: 2, value: 'best_selling', label: 'Best Selling'},
        {id: 3, value: 'title-ascending', label: 'Alphabetically, A-Z'},
        {id: 4, value: 'title-descending', label: 'Alphabetically, Z-A'},
        {id: 5, value: 'price-ascending', label: 'Price, low to high'},
        {id: 6, value: 'price-descending', label: 'Price, high to low'},
        // {id: 7, value: 'created_descending', label: 'New Arrival'}
    ];
    isPriceRangeShow: boolean;
    price_range: any;
    minimum_price: number;
    maximum_price: number;
    sort_by: string;

    @ViewChild(IonContent, {static: true}) content: IonContent;

    @ViewChild('skinTypeWrap', {static: false}) skinTypeWrap: IonicSelectableComponent;
    @ViewChild('brandWrap', {static: false}) brandWrap: IonicSelectableComponent;
    @ViewChild('categoryWrap', {static: false}) categoryWrap: IonicSelectableComponent;
    @ViewChild('sortWrap', {static: false}) sortWrap: IonicSelectableComponent;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        private productService: ProductService,
        private navCtrl: NavController,
        private sharedService: SharedService
    ) {
        this.browse_by = this.route.snapshot.params.product_browse_by;
        this.category_id = this.route.snapshot.params.category_id;
        this.category_name = this.route.snapshot.params.category_name;
        this.brand_id = this.route.snapshot.params.brand_id;
        this.brand_name = this.route.snapshot.params.brand_name;
        this.offer_id = this.route.snapshot.params.offer_id;
        this.offer_name = this.route.snapshot.params.offer_name;
        this.skin_type = this.route.snapshot.params.skin_type;
        this.sort_by = this.route.snapshot.params.sort_by;
        this.trending_id = this.route.snapshot.params.trending_id;
        this.trending_name = this.route.snapshot.params.trending_name;
        this.search_text = this.route.snapshot.params.search_text;
        this.gift_id = this.route.snapshot.params.gift_id;
        this.gift_name = this.route.snapshot.params.gift_name;
    }

    ngOnInit() {
        this.productFindFuction();
    }

    ngOnDestroy() {
        this.page = null;
        this.listData = null;
        this.browse_by = null;
        this.category_id = null;
        this.category_name = null;
        this.brand_id = null;
        this.brand_name = null;
        this.offer_id = null;
        this.skin_type = null;
        this.sort_by = null;
        this.trending_id = null;
        this.filterList = null;
    }

    
    selectSkinType(ev: {value: any}) {
        if(!this.filterList) {this.insertintoLastFilter();}
        let selected_data = {name: 'skin_type', label: ev.value['label'], value: ev.value['value']};
        if(this.filterList) {
            let index = this.filterList.findIndex(item => item.name === 'skin_type');
            if(index === -1) {
                this.filterList.push(selected_data);
            } else {
                this.filterList.splice(index, 1, selected_data);
            }
        }
        this.page = null;
        this.listData = null;
        this.scrollToTop();
        this.productFindFuction();
    }

    getBrandListData() {
        if(this.brandList) {return false;}
        this.sharedService.loadingStart();
        this.productService.getBrandList().subscribe(res => {
            this.brandList = res;
            this.sharedService.loadingClose();
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }
    selectBrand(ev: {value: any}) {
        if(!this.filterList) {this.insertintoLastFilter();}
        let selected_data = {name: 'brand', label: ev.value['name'], value: ev.value['id']};
        if(this.filterList) {
            let index = this.filterList.findIndex(item => item.name === 'brand');
            if(index === -1) {
                this.filterList.push(selected_data);
            } else {
                this.filterList.splice(index, 1, selected_data);
            }
        }
        this.page = null;
        this.listData = null;
        this.scrollToTop();
        this.productFindFuction();
    }

    getCategoryListData() {
        if(this.categoryList) {return false;}
        this.sharedService.loadingStart();
        this.productService.getCategoryList().subscribe(res => {
            this.sharedService.loadingClose();
            this.categoryList = [];
            res.forEach(ele => {
                ele['children'].forEach(item => {
                    let grp = {id: ele.id, name: ele.name}
                    const grpItem : any = {id: item.id, name: item.name};
                    grpItem.group = grp;
                    this.categoryList.push(grpItem);
                });
            });
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }
    selectCategory(ev: {value: any}) {
        if(!this.filterList) {this.insertintoLastFilter();}
        let selected_data = {name: 'category', label: ev.value['name'], value: ev.value['id']};
        if(this.filterList) {
            let index = this.filterList.findIndex(item => item.name === 'category');
            if(index === -1) {
                this.filterList.push(selected_data);
            } else {
                this.filterList.splice(index, 1, selected_data);
            }
        }
        this.page = null;
        this.listData = null;
        this.scrollToTop();
        this.productFindFuction();
    }



    priceRangeChange(data) {
        if(!this.filterList) {this.insertintoLastFilter();}
        if(!data || data === NaN) {
            let index = this.filterList.findIndex(item => item.name === 'price');
            if(index !== -1) {
                this.removeFromFilter({name: 'price'});
            }
            return false;
        }
        let selected_data = {name: 'price', label: 'min: '+data.lower+ ', max: '+data.upper, value: {min: data.lower, max: data.upper}};
        if(this.filterList) {
            let index = this.filterList.findIndex(item => item.name === 'price');
            if(index === -1) {
                this.filterList.push(selected_data);
            } else {
                this.filterList.splice(index, 1, selected_data);
            }
        }
        this.page = null;
        this.listData = null;
        this.scrollToTop();
        this.productFindFuction();
    }

    clearFilter() {
        this.skinTypeWrap.clear();
        this.brandWrap.clear();
        this.categoryWrap.clear();
        this.sortWrap.clear();
        this.filterList = null;
        this.sort_by = null;
        this.page = null;
        this.listData = null;
        this.scrollToTop();
        this.productFindFuction();
    }

    removeFromFilter(option: any) {
        if(option.name === 'skin_type') {this.skinTypeWrap.clear();}
        if(option.name === 'brand') {this.brandWrap.clear();}
        if(option.name === 'category') {this.categoryWrap.clear();}
        if(option.name === 'sort_by') {this.sortWrap.clear();}
        if(!this.filterList || this.filterList.length <= 0) {return false;}
        let index = this.filterList.findIndex(item => item.name === option.name);
        this.filterList.splice(index, 1);
        if(!this.filterList || this.filterList.length <= 0) {
            this.clearFilter();
            return false;
        }
        this.page = null;
        this.listData = null;
        this.scrollToTop();
        this.productFindFuction();
    }

    productFindFuction(event?) {
        if (this.browse_by === 'new_arrival' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getNewArrivalProducts(this.page).subscribe(res => {
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
        } else if (this.browse_by === 'category' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getProductsByCategoryId(this.category_id, this.page).subscribe(res => {
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
        } else if (this.browse_by === 'brand' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getProductsByBrandId(this.brand_id, this.page).subscribe(res => {
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
        } else if (this.browse_by === 'offer' && !this.filterList) {
            this.sharedService.loadingStart();
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
        } else if (this.browse_by === 'skin_type' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getSkinTypeProducts(this.skin_type, this.page).subscribe(res => {
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
        } else if (this.browse_by === 'best_seller' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getBestSellerProduct(this.page).subscribe(res => {
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
        } else if (this.browse_by === 'trending' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getTrendingProducts(this.trending_id).subscribe(res => {
                this.sharedService.loadingClose();
                this.listData = res['data'];
                this.listDataTotal = res['total'];
                this.page = res['current_page'] + 1;
                if (event) event.target.complete();
            }, err => {
                this.sharedService.loadingClose();
                //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
            });
        } else if (this.browse_by === 'back_in_stock' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getBackStockProduct(this.page).subscribe(res => {
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
        } else if (this.browse_by === 'search' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.searchProductsOnEnter(this.search_text, this.page).subscribe(res => {
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
        } else if (this.browse_by === 'cat_in_stock' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getCategorySortingProductsByInStock(this.category_id).subscribe(res => {
                this.sharedService.loadingClose();
                if (!this.listData) {
                    this.listData = res;
                    this.listDataTotal = res['length'];
                    this.scrollToTop();
                } else {
                    res.forEach(item => {
                        this.listData.push(item);
                    });
                }
                this.page = res['current_page'] + 1;
                if (event) event.target.complete();
            }, err => {
                this.sharedService.loadingClose();
                //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
            });
        } else if (this.browse_by === 'cat_new_arrival' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getCategorySortingProductsByNewArrival(this.category_id).subscribe(res => {
                this.sharedService.loadingClose();
                if (!this.listData) {
                    this.listData = res;
                    this.listDataTotal = res['length'];
                    this.scrollToTop();
                } else {
                    res.forEach(item => {
                        this.listData.push(item);
                    });
                }
                this.page = res['current_page'] + 1;
                if (event) event.target.complete();
            }, err => {
                this.sharedService.loadingClose();
                //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
            });
        } else if (this.browse_by === 'cat_sort_by' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getCategorySortingProducts(this.sort_by, this.category_id, this.page).subscribe(res => {
                this.sharedService.loadingClose();
                if (!this.listData) {
                    this.listData = res['data'];
                    this.listDataTotal = res['total'];
                    this.scrollToTop();
                } else {
                    res['data'].forEach(item => {
                        this.listData.push(item);
                    });
                }
                this.page = res['current_page'] + 1;
                if (event) event.target.complete();
            }, err => {
                this.sharedService.loadingClose();
                //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
            });
        } else if (this.browse_by === 'holiday_shop' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getHolidayShopProducts(this.page).subscribe(res => {
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
        } else if (this.browse_by === 'combo_offer' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getComboProducts(this.page).subscribe(res => {
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
        } else if (this.browse_by === 'holiday_shop_gift' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getHolidayShopGiftProducts(this.gift_id, this.page).subscribe(res => {
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
        } else if (this.browse_by === 'special_offers' && !this.filterList) {
            let data = {};
            if(this.category_id) {
                data['parents'] = this.offer_id;
                data['for'] = 'category';
                data['id'] = this.category_id;
            } else {
                data['parents'] = this.offer_id;
                data['for'] = 'brand';
                data['id'] = this.brand_id;
            }
            this.sharedService.loadingStart();
            this.productService.getSpecialOfferProducts(data, this.page).subscribe(res => {
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
        } else if (this.browse_by === 'baby_care' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getBabyCareProducts(this.page).subscribe(res => {
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
        } else if (this.browse_by === 'exclusive_sale' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getExclusiveSaleProducts(this.page).subscribe(res => {
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
        } else if (this.browse_by === 'featured' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getFeaturedProducts(this.page).subscribe(res => {
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
        } else if (this.browse_by === 'life_style' && !this.filterList) {
            this.sharedService.loadingStart();
            this.productService.getLifestyleProducts(this.page).subscribe(res => {
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
        } else if (this.browse_by === 'filter' || (this.filterList && this.filterList.length > 0)) {
            this.sharedService.loadingStart();
            this.productService.getFilterProducts(this.filterList, this.page).subscribe(res => {
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
    }

    loadMoreData(event) {
        this.productFindFuction(event);
        if (this.listData && this.listData.length === this.listDataTotal) {
            event.target.disabled = true;
        }
    }

    pageScrolling(ev) {
        if (ev.detail.scrollTop >= 1500) {
            this.isScollTopBarShow = true;
        } else {
            this.isScollTopBarShow = false;
        }
    }

    scrollToTop() {
        this.content.scrollToTop(400);
    }

    gotoBack() {
        this.navCtrl.back();
    }

    selectSortBy(ev: {value: any}) {
        if(!this.filterList) {this.insertintoLastFilter();}
        let selected_data = {name: 'sort_by', label: ev.value['label'], value: ev.value['value']};
        if(this.filterList) {
            let index = this.filterList.findIndex(item => item.name === 'sort_by');
            if(index === -1) {
                this.filterList.push(selected_data);
            } else {
                this.filterList.splice(index, 1, selected_data);
            }
        }
        this.page = null;
        this.listData = null;
        this.scrollToTop();
        this.productFindFuction();
    }

    goBack() {
        this.navCtrl.back();
    }

    insertintoLastFilter() {
        this.filterList = [];
        if (this.browse_by === 'skin_type'){
            let selected_data = {name: 'skin_type', label: this.skin_type, value: this.skin_type};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'category'){
            let selected_data = {name: 'category', label: this.category_name, value: this.category_id};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'brand'){
            let selected_data = {name: 'brand', label: this.brand_name, value: this.brand_id};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'offer'){
            let selected_data = {name: 'offer', label: this.offer_name, value: this.offer_id};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'trending'){
            let selected_data = {name: 'trending', label: this.trending_name, value: this.trending_id};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'holiday_shop_gift'){
            let selected_data = {name: 'gift', label: this.gift_name, value: this.gift_id};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'search'){
            let selected_data = {name: 'search', label: (this.search_text.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.search_text};
            this.filterList.push(selected_data);
        }        
        if (this.browse_by === 'cat_sort_by'){
            let selected_data = [
                {name: 'sort_by', label: this.sort_by, value: this.sort_by},
                {name: 'category', label: this.category_name, value: this.category_id}
            ];
            selected_data.forEach(element => {
                this.filterList.push(element);
            });
        }
        if (this.browse_by === 'best_seller'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'back_in_stock'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'cat_in_stock'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'cat_new_arrival'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'holiday_shop'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'combo_offer'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'special_offers'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'baby_care'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'exclusive_sale'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'featured'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
        if (this.browse_by === 'life_style'){
            let selected_data = {name: 'product_type', label: (this.browse_by.replace(/[^a-zA-Z0-9]/ig, ' ').toLowerCase()).trim(), value: this.browse_by};
            this.filterList.push(selected_data);
        }
    }
}