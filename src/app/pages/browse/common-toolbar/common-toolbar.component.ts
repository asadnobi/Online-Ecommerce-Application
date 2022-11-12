import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
//componnets
import { SearchComponent } from 'src/app/popovers/search/search.component';

@Component({
  selector: 'app-common-toolbar',
  templateUrl: './common-toolbar.component.html',
  styleUrls: ['./common-toolbar.component.scss'],
})
export class CommonToolbarComponent implements OnInit {
  defaultImage: string = 'assets/images/no-img.jpg';

  constructor(
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  async openSearchbar(ev: any) {
    const searchbar = await this.popoverCtrl.create({
        component: SearchComponent,
        event: ev,
        translucent: true,
        mode: 'ios',
        cssClass: 'full-width-popover-dark-opacity'
    });

    return await searchbar.present();
  }


}
