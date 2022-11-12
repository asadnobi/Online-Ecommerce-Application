import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NavController, Platform, ToastController} from '@ionic/angular';
//plugin
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
//helper
import {MustMatch} from 'src/app/_helpers/must-match.validator';
//ervice
import {UserService} from 'src/app/services/user.service';
import {SharedService} from 'src/app/services/shared.service';
import { StoreService } from 'src/app/services/store.service';


@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.page.html',
    styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
    switch: string = 'sign-in';
    login_by: string = 'mobile';
    emailForm: FormGroup;
    numberForm: FormGroup;
    regForm: FormGroup;
    phoneModel: any;
    submitted: boolean = false;
    public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public phoneRegex = /^(?:\+?880|00880)?1[34-9]\d{8}$/;
    googleAuthData: any = {};
    facebookAuthData: any = {};
    appleAuthData: any = {};

    isAppledevice: boolean = false;

    constructor(
        private platform: Platform,
        private router: Router,
        public navCtrl: NavController,
        public user: UserService,
        private shared: SharedService,
        private fb: FormBuilder,
        private facebook: Facebook,
        private googlePlus: GooglePlus,
        private signInWithApple: SignInWithApple,
        public toastController: ToastController,
        private storeService: StoreService
    ) {
        this.phoneModel = {phone_number: ''};
        this.emailForm = this.fb.group({
            email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
        this.numberForm = this.fb.group({
            phone_number: ['', [Validators.required, Validators.pattern(this.phoneRegex)]]
        });
        this.regForm = this.fb.group({
            first_name: ['', [Validators.required, Validators.minLength(2)]],
            last_name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailRegex)]],
            phone: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            password_confirmation: ['', [Validators.required]]
        }, {
            validator: [
                MustMatch('password', 'password_confirmation')
            ]
        });
        this.isAppledevice = this.platform.platforms().some(p => p === 'ios');
    }

    ionViewDidEnter() {
        this.storeService.user.subscribe(res => {
            if (Object.getOwnPropertyNames(res).length !== 0) {
                if (res['isLogged']) {
                    let hasRoute = this.storeService.route.getValue();
                    if(hasRoute && hasRoute['page']) {
                        this.router.navigate(['/'+ hasRoute['page']]).then(() => {
                            this.storeService.removeRoute();
                            this.shared.toast('Welcome, You are logged in!!', 2000, 'success');
                        });
                    } else {
                        this.router.navigate(['/tabs/account']).then(() => {
                            this.shared.toast('Welcome, You are logged in!!', 2000, 'success');
                        });
                    }
                }
            }
        });
    }


    emailLogin(data) {
        this.submitted = true;
        if (this.emailForm.invalid) return;
        // this.sharedService.alert('Warning!', null, 'Please confirm required field');
        this.shared.loadingStart();
        this.user.loginAuth(data).subscribe((res: any) => {
            this.shared.loadingClose();
            this.successLogin(res['token']);
        }, err => {
            this.shared.loadingClose();
            if (err) {
                this.presentToast('Please enter valid login credentials!', 2000);
            }
        });
    }

    otpLogin(data) {
        this.submitted = true;
        if (this.numberForm.status === 'INVALID') {
            return;
            // this.sharedService.alert('Warning!', null, 'Please confirm required field');
        } else {
            let country_code = "+880";
            let _data = {phone_number: country_code.concat(data['phone_number'].slice(data['phone_number'].length - 10))};
            this.shared.loadingStart();
            this.user.otpSendMobileNo(_data).subscribe(result => {
                this.shared.loadingClose();
                if (result['success']) {
                    this.router.navigate(['/auth/login-pin'], {queryParams: _data});
                }
            }, err => {
                this.shared.loadingClose();
                //this.shared.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
            });
        }

    }

    register(formdata: any) {
        this.submitted = true;
        if (this.regForm.status === 'INVALID') {
            return;
        } else {
            let country_code = "+880";
            let _data = {
                first_name: formdata['first_name'] ? formdata['first_name'] : null,
                last_name: formdata['last_name'] ? formdata['last_name'] : null,
                email: formdata['email'] ? formdata['email'] : null,
                phone: formdata['phone'] ? country_code.concat(formdata['phone'].slice(formdata['phone'].length - 10)) : null,
                password: formdata['password'] ? formdata['password'] : null,
                password_confirmation: formdata['password_confirmation'] ? formdata['password_confirmation'] : null,
            }
            this.shared.loadingStart();
            this.user.registration(_data).subscribe((res: any) => {
                this.shared.loadingClose();
                this.successLogin(res);
            }, err => {
                this.shared.loadingClose();
                if (err) {
                    this.shared.toast(err.error.msg ? err.error.msg : err.error.message ? err.error.message : 'Sorry!! cannot process now, try again!!', 2000, 'danger');
                }
            });
        }
    }

    switchChange(item) {
        this.switch = item;
    }

    loginBy(method: string) {
        this.login_by = method;
    }


    //common
    async presentToast(msg: string, endtime: number) {
        const toast = await this.toastController.create({message: msg, duration: endtime});
        toast.present();
    }

    get f() {
        return this.numberForm.controls;
    }

    get r() {
        return this.regForm.controls;
    }

    get e() {
        return this.emailForm.controls;
    }

    googleSignIn() {
        this.shared.loadingStart();
        this.googlePlus.login({}).then(res => {
            this.shared.loadingClose();
            if (res) {
                this.googleAuthData = res;
                this.shared.loadingStart();
                this.user.socialLoginAuth({
                    google_id: res.userId,
                    email: res.email,
                    first_name: res.givenName,
                    last_name: res.familyName
                }).subscribe((response: any) => {
                    this.shared.loadingClose();
                    if (response) {
                        this.successLogin(response['token'])
                    }
                }, err => {
                    this.shared.loadingClose();
                    if (err) {
                        this.shared.toast(err.error.msg ? err.error.msg : err.error.message ? err.error.message : 'Sorry!! cannot process now, try again!!', 2000, 'danger');
                    }
                });
            }
        }).catch(err => {
            this.shared.loadingClose();
            //this.shared.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
            this.googleAuthData = `Error ${JSON.stringify(err)}`
        });
    }

    facebookSignIn() {
        this.shared.loadingStart();
        this.facebook.login(['public_profile', 'user_friends', 'email']).then((fbRes: FacebookLoginResponse) => {
            this.shared.loadingClose();
            if (fbRes.status === 'connected') {
              this.shared.loadingStart();
              this.facebook.api('/' + fbRes.authResponse.userID + '/?fields=id,email,name,picture', ['public_profile']).then(res => {
                  this.shared.loadingClose();
                  this.facebookAuthData = res;
                  this.user.socialLoginAuth({
                      facebook_id: fbRes.authResponse.userID,
                      email: res.email,
                      first_name: res.name
                  }).subscribe((response: any) => {
                      this.shared.loadingClose();
                      if (response) {
                          this.successLogin(response.token);
                      }
                  }, err => {
                    //  console.error('err1:',err);
                      this.shared.loadingClose();
                      if(!err || !err.error) return;
                      this.shared.toast(err.error.msg ? err.error.msg : err.error.message ? err.error.message : 'Sorry!! cannot process now, try again!!', 2000, 'danger');
                  });
              }).catch(err => {
                  this.shared.loadingClose();
                  if(!err || !err.error) return;
                  this.shared.toast(err.error.msg ? err.error.msg : err.error.message ? err.error.message : 'Sorry!! cannot process now, try again!!', 2000, 'danger');
              });
          }
        }).catch(err => {
            this.shared.loadingClose();
            if(!err || !err.error) return;
            this.shared.toast(err.error.msg ? err.error.msg : err.error.message ? err.error.message : 'Sorry!! cannot process now, try again!!', 2000, 'danger');
        });
    }

    appleSignIn() {
        if (!this.isAppledevice) return;
        this.shared.loadingStart();
        this.signInWithApple.signin({
            requestedScopes: [
                ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
                ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
            ]
        }).then((res: AppleSignInResponse) => {
            this.shared.loadingClose();
            // need to send data to api for match user
            if (res) {
                this.appleAuthData = res;
                this.shared.loadingStart();
                this.user.socialLoginAuth({
                    apple_id: res.identityToken,
                    email: res.email,
                    first_name: res.fullName.givenName,
                    last_name: res.fullName.familyName
                }).subscribe((response: any) => {
                    this.shared.loadingClose();
                    if (response) {
                        this.successLogin(response['token']);
                    }
                }, err => {
                    this.shared.loadingClose();
                    if (err) {
                        this.shared.toast(err.error.msg ? err.error.msg : err.error.message ? err.error.message : 'Sorry!! cannot process now, try again!!', 2000, 'danger');
                    }
                });
            }
        }).catch((error: AppleSignInErrorResponse) => {
            this.shared.loadingClose();
            this.shared.toast(error.localizedDescription ? error.localizedDescription : 'Sorry!! cannot process now, try again!!', 2000, 'danger');
        });
    }


    successLogin(login_token) {
        this.shared.loadingStart();
        this.user.userData(login_token).subscribe(res => {
            this.shared.loadingClose();
            if (res) {
                this.storeService.saveLoginData({ isLogged: true, data: res, token: login_token });
            }
        }, err => {
            this.shared.loadingClose();
        });
    }


}
