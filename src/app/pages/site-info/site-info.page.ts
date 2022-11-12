import { AfterContentInit, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//services
import {HttpService} from '../../services/http.service';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
// import { PixelService } from 'ngx-pixel';

@Component({
    selector: 'app-site-info',
    templateUrl: './site-info.page.html',
    styleUrls: ['./site-info.page.scss'],
})
export class SiteInfoPage implements OnInit, AfterContentInit {
    pageData: any;
    page: string;
    content: any;
    contactForm: FormGroup;
    userData: any;
    
    public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public phoneRegex = /^(?:\+?88|0088)?01[34-9]\d{8}$/;
    submitted: boolean = false;

    constructor(
        private httpService: HttpService,
        private userService: UserService,
        private sharedService: SharedService,
        public route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        // private pixel: PixelService
    ) {
        this.route.queryParams.subscribe(res => {
            this.page = res.page;
        });
    }

    ngOnInit() {
        this.contactForm = this.fb.group({
            subject: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailRegex)]],
            phone: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
            message: ['', [Validators.required, Validators.minLength(5)]],
            order: [''],
            file: ['']
        });
        this.getPageInfo();
    }
    ngAfterContentInit() {
        if(this.page === 'contact-us') {
            // this.pixel.track('Contact');
        }
    }
    
    getPageInfo() {
        if(this.page === 'contact-us') {
            if (localStorage.getItem('user_data')) {
                this.userData = JSON.parse(localStorage.getItem('user_data'));
                // console.log(this.userData);
                if(this.userData && this.userData.email) {
                    this.contactForm.controls['email'].setValue(this.userData.email);
                }
                if(this.userData && this.userData.phone) {
                    this.contactForm.controls['phone'].setValue(this.userData.phone);
                }
            }
            return false;
        }
        this.sharedService.loadingStart();
        this.httpService.pageInfo(this.page).subscribe(res => {
            this.sharedService.loadingClose();
            this.pageData = res;            
            this.content = this.sanitizer.bypassSecurityTrustHtml(this.pageData['content']);
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    sendMessage() {
        this.submitted = true;
        if (this.contactForm.status === 'INVALID') {
            return false;
        } else {
            this.sharedService.loadingStart();
            this.userService.sendContactFormEmail(this.contactForm.value).subscribe(res => {
                this.sharedService.loadingClose();
                if (res) {
                    this.submitted = false;
                    this.contactForm.reset();
                    this.sharedService.toast(res['msg'], 3000, 'success');
                }
            }, err => {
                this.sharedService.loadingClose();
                this.sharedService.toast(err['error']['msg'], 6000);
            });
        }
    }

    get f() {
        return this.contactForm.controls;
    }

    oploadFile(fileChangeEvent) {
        const uploadFile = fileChangeEvent.target.files[0];
        let formData = new FormData();
        formData.append("file", uploadFile, uploadFile.name);
    }

}
