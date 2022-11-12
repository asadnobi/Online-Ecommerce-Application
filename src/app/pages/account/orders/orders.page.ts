import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {SharedService} from '../../../services/shared.service';
import {ProductService} from '../../../services/product.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
    defaultImage: string = 'assets/images/no-img.jpg';
    orderList: any;
    new_arrival: any;

    constructor(private userService: UserService,
                private sharedService: SharedService,
                private productService: ProductService,
                public router: Router) {
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.getOrderData();
        this.getNewArrivalProducts();
    }

    getOrderData() {
        this.userService.getOrderList().subscribe(res => {
            setTimeout(() => {
                this.orderList = res;
            }, 500);
        });
    }

    orderDetails(id) {
        this.router.navigate(['/tabs/order-details', id, 2]);
    }


    getNewArrivalProducts() {
        this.productService.getNewArrivalProducts().subscribe(res => {
            setTimeout(() => {
                this.new_arrival = res['data'];
            }, 100);
        });
    }

    all_newly_created() {
        this.router.navigate(['/tabs/products', {product_browse_by: 'new_arrival'}]);
    }

}
