import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {UserService} from 'src/app/services/user.service';
import {SharedService} from 'src/app/services/shared.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
    selector: 'app-login-pin',
    templateUrl: './login-pin.page.html',
    styleUrls: ['./login-pin.page.scss'],
})
export class LoginPinPage implements OnInit, OnDestroy {
    phone_number: string;
    form: FormGroup;

    timerInterval: any;
    timer: number;
    min: string = "00";
    sec: string = "00";

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        private fb: FormBuilder,
        private shared: SharedService,
        public toastController: ToastController,
        private userService: UserService,
        private storeService: StoreService
    ) {           
        this.route.queryParams.subscribe(params => {
            this.phone_number = params.phone_number;
        });
        this.form = this.fb.group({
            pin_number: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]]
        });
    }

    ngOnInit() {
    }


    ngOnDestroy() {
        clearInterval(this.timerInterval);
    }

    pinMatch(data) {
        if (this.form.status === 'INVALID') {
            return;
            // this.sharedService.alert('Warning!', null, 'Please confirm required field');
        } else {
            const matchData = {'phone_number': this.phone_number, 'pin': data.pin_number};
            this.shared.loadingStart();
            this.userService.otpMatchPin(matchData).subscribe(res => {
                this.shared.loadingClose();
                this.form.reset();
                if (res) {
                    this.successLogin(res['token'])
                }
            }, err => {
                this.shared.loadingClose();
                if (err) {
                    this.shared.toast(err.error.error ? err.error.error : err.error.msg ? err.error.msg : err.error.message ? err.error.message : 'Sorry!! cannot process now, try again!!', 2000, 'danger');
                }
            });
        }
    }

    newPin() {
        const data = {'phone_number': this.phone_number};
        this.shared.loadingStart();
        this.userService.otpSendMobileNo(data).subscribe(result => {
            this.shared.loadingClose();
            if(result) {
                this.presentToast(result['success'], 2000, 'success');
                this.timer = (1000 * 60) * 3;
                this.countdownOTPTime();
            }
        }, err => {
            this.shared.loadingClose();
            //this.shared.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    //common
    async presentToast(msg: string, endtime: number, color: string) {
        const toast = await this.toastController.create({
            message: msg, duration: endtime, color: color,
            buttons: [{side: 'end', icon: 'close', role: 'cancel'}]
        });
        await toast.present();
    }

    get f() {
        return this.form.controls;
    }

    countdownOTPTime() {
        if(this.timer > 0) {
          this.timerInterval = setInterval(() => {
            this.timer = this.timer - 1000;
            // timer covert to minute and seconds
            let min = Math.floor((this.timer / (1000 * 60)) % 60);
            let sec = Math.floor((this.timer / 1000) % 60);
            this.min = min < 10 ? '0'+min : min.toString();
            this.sec = sec < 10 ? '0'+sec : sec.toString();
            if(this.timer <= 0) {
              clearInterval(this.timerInterval);
            }
          }, 1000);
        }
    }

    successLogin(login_token) {
        this.shared.loadingStart();
        this.userService.userData(login_token).subscribe(res => {
            this.shared.loadingClose();
            if (!res) return;
            this.storeService.saveLoginData({ isLogged: true, data: res, token: login_token });
        }, err => {
            this.shared.loadingClose();
            //this.shared.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

}
