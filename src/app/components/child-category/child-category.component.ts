import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ProductService} from 'src/app/services/product.service';
import {SharedService} from 'src/app/services/shared.service';

@Component({
    selector: 'app-child-category',
    templateUrl: './child-category.component.html',
    styleUrls: ['./child-category.component.scss'],
})
export class ChildCategoryComponent implements OnInit {
    categoryId: number;
    categoryName: string;
    catListData: any;
    subCatList: any;
    subCategoryName: string;
    subCategoryId: number;

    constructor(public router: Router,
                public route: ActivatedRoute,
                private productService: ProductService,
                private sharedService: SharedService) {

    }

    ngOnInit() {
        // this.productService.setRedirectPage(this.router.url);
        this.route.queryParamMap.subscribe(_state => {
            if (_state && _state.get('_list_for')) {
                this.categoryId = JSON.parse(_state.get('_list_for')).category_id;
                this.categoryName = JSON.parse(_state.get('_list_for')).category_name;
            }

            if (_state && _state.get('_list')) {
                this.catListData = JSON.parse(_state.get('_list'));
            }
        });

    }


    sortByInStock() {
        // this.productService.setRedirectPage(this.router.url);
        this.router.navigate(['/tabs/products', {
            product_browse_by: 'cat_in_stock',
            category_id: this.categoryId,
            category_name: this.categoryName
        }]);
    }

    sortByNewArrival() {
        // this.productService.setRedirectPage(this.router.url);
        this.router.navigate(['/tabs/products', {
            product_browse_by: 'cat_new_arrival',
            category_id: this.categoryId,
            category_name: this.categoryName
        }]);
    }

    sortBy(option) {
        // this.productService.setRedirectPage(this.router.url);
        this.router.navigate(['/tabs/products', {
            product_browse_by: 'cat_sort_by',
            category_id: this.categoryId,
            category_name: this.categoryName,
            sort_by: option
        }]);
    }

    selectCategory(category: any) {
        this.productService.getChildCategoryList(category.id).subscribe(result => {
            if (result && result.length > 0) {
                this.subCatList = result;
                this.subCategoryName = category.name;
                this.subCategoryId = category.id;
            } else {
                this.productService.setRedirectPage(this.router.url);
                this.router.navigate(['/tabs/products', {
                    product_browse_by: 'category',
                    category_id: category.id,
                    category_name: category.name
                }]);
            }
        });
    }

    showAll(catId: number, catName: string) {
        // this.productService.setRedirectPage(this.router.url);
        this.router.navigate(['/tabs/products', {
            product_browse_by: 'category',
            category_id: catId,
            category_name: catName
        }]);
    }

    jsonConvert(data) {
        return JSON.parse(data ? data : this.catListData);
    }

    backClose() {
        if(this.subCatList && this.subCatList.length > 0) {
            this.subCatList = undefined;
            this.subCategoryName = undefined;
        } else {
            this.router.navigate(['/tabs/browse']);
        }
    }

}
