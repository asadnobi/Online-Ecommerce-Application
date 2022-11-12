import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-review-page-menu',
  templateUrl: './review-page-menu.component.html',
  styleUrls: ['./review-page-menu.component.scss'],
})
export class ReviewPageMenuComponent implements OnInit {
  product_id: number;

  constructor(
    public navParams: NavParams,
    public popoverCtrl: PopoverController
  ) {
    this.product_id = this.navParams.data['product_id'];
  }

  ngOnInit() {}

  close() {
    this.popoverCtrl.dismiss();
  }

}
