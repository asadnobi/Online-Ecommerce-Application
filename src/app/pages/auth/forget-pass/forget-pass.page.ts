import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {SharedService} from '../../../services/shared.service';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-forget-pass',
    templateUrl: './forget-pass.page.html',
    styleUrls: ['./forget-pass.page.scss'],
})
export class ForgetPassPage implements OnInit {
    form: FormGroup;
    submitted: boolean = false;
    public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(private sharedService: SharedService,
                private userService: UserService,
                public fb: FormBuilder,
                public router: Router) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.pattern(this.emailRegex)]]
        });
    }

    ngOnInit() {
        const userData = JSON.parse(localStorage.getItem('user_data'));
        if (userData) {
            this.form.patchValue({
                email: userData.email
            });
        }
    }

    sendEmail(data) {
        this.submitted = true;
        if (this.form.status === "VALID") {
            this.sharedService.loadingStart();
            this.userService.forgetPassEmailSend(data).subscribe(result => {
                this.sharedService.loadingClose();
                if (result) {
                    this.sharedService.toast(result['message'], 5000, 'waring').then(() => {
                        // let route = sessionStorage.getItem('route');
                        this.router.navigateByUrl('/auth/sign-in');
                    });
                }
            }, err => {
                this.sharedService.loadingClose();
                //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
            });
        }
    }

    get f() {
        return this.form.controls;
    }

}
