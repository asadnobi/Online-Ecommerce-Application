import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsPageRoutingModule } from './tabs-routing.module';
//pluign
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule, CommonModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage],
  providers: [InAppBrowser]
})
export class TabsPageModule {}
