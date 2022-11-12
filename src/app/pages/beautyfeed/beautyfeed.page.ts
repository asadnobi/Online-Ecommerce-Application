import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
// services
import {SharedService} from '../../services/shared.service';
import {HttpService} from '../../services/http.service';
// components
import {BlogDetailsComponent} from '../../modals/blog-details/blog-details.component';

@Component({
    selector: 'app-beautyfeed',
    templateUrl: './beautyfeed.page.html',
    styleUrls: ['./beautyfeed.page.scss'],
})
export class BeautyfeedPage implements OnInit {
    defaultImage: string = 'assets/images/no-img.jpg';
    selectedFeed: any;
    blogCategoryList: any;
    blogData: any;
    filterBlogData: any;
    searchBar: boolean;
    searchText: string;

    constructor(
        private sharedService: SharedService,
        private httpService: HttpService,
        public modalCtrl: ModalController
    ) {
    }

    ngOnInit() {
        this.selectedFeed = 0;
        this.getBlogCategories();
        this.getBlogData();
    }

    getBlogCategories() {
        this.httpService.getBlogCategories().subscribe(result => {
            let all = {id: 0, name: "Home", slug: "home"}
            this.blogCategoryList = [all].concat(result);
        });
    }

    getBlogData() {
        this.sharedService.loadingStart();
        this.httpService.getBlogData().subscribe(result => {
            this.sharedService.loadingClose();
            this.blogData = result;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    async blogDetails(blogId) { // open modal for blog details
        const modal = await this.modalCtrl.create({
            component: BlogDetailsComponent,
            componentProps: {blog_id: blogId}
        });
        return await modal.present();
    }

    feedSelect(ev) {
        if (ev.detail.value == 0) {
            this.filterBlogData = this.blogData;
        } else {
            this.filterBlogData = this.blogData.filter(function (ele) {
                return ele.category_id == ev.detail.value;
            });
        }
    }

    blogFilter() {
        this.sharedService.loadingStart();
        setTimeout(() => {
            this.sharedService.loadingClose();
            this.selectedFeed = 0;
            this.filterBlogData = this.blogData.reverse();
        }, 50);
    }

    searchBlogByText() {
        this.searchBar = false
        this.sharedService.loadingStart();
        this.httpService.getBlogBySearchString(this.searchText).subscribe(result => {
            this.sharedService.loadingClose();
            this.filterBlogData = result;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    clearFilter() {
        this.searchText = null;
        this.filterBlogData = null;
    }

}
