import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
//services
import {ProductService} from 'src/app/services/product.service';
import {SharedService} from 'src/app/services/shared.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit {
  brandList: any;
  brands: any;
  searchBrandsText: any;
  brandSearchResult: any;
  currentSection = 'section0';

  constructor(
    public router: Router,
    private productService: ProductService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getBrands();
  }

  getBrands() {
    this.sharedService.loadingStart();
    this.productService.getBrandList().subscribe(res => {
        this.sharedService.loadingClose();
        this.brandList = res;
        let data = res.reduce((r, e) => {
            let group = e.name[0].toUpperCase();
            if (!r[group]) r[group] = {group, children: [e]}
            else r[group].children.push(e);
            return r;
        }, {})
        this.brands = Object.values(data);
    }, err => {
        this.sharedService.loadingClose();
        //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
    });
  }

  selectBrand(brandId, brandName) {
    this.productService.setRedirectPage('/tabs/browse');
    this.router.navigate(['/tabs/products', {
        product_browse_by: 'brand',
        brand_id: brandId,
        brand_name: brandName
    }]);
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }
  scrollBrands(section) {
      const targetElement = document.querySelector('#' + section) as HTMLElement;
      targetElement.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  searchBrand(ev: any) {
    
  }

}
