import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {SignInPageRoutingModule} from './sign-in-routing.module';
import {SignInPage} from './sign-in.page';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { SignInWithApple } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        SignInPageRoutingModule
    ],
    declarations: [SignInPage],
    providers: [GooglePlus, Facebook, SignInWithApple]
})
export class SignInPageModule {
}
