import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, AlertController} from '@ionic/angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AddAddressComponent} from 'src/app/modals/add-address/add-address.component';
import {UserService} from '../../../services/user.service';
import {HttpService} from '../../../services/http.service';
import {SharedService} from '../../../services/shared.service';
import { StoreService } from 'src/app/services/store.service';
import { Router } from '@angular/router';

class CityType {
    public id: number;
    public name: string;
}
class AreaType {
    public id: number;
    public name: string;
}

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.page.html',
    styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage {
    item: any;
    userData: any;
    deliveryAddressList: any;
    userForm: FormGroup;
    public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public phoneRegex = /^(?:\+?88|0088)?01[34-9]\d{8}$/;
    cityList: CityType[];
    areaList: AreaType[];

    constructor(
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public fb: FormBuilder,
        private userService: UserService,
        private httpService: HttpService,
        private sharedService: SharedService,
        private storeService: StoreService,
        private router: Router
    ) {
        this.userForm = this.fb.group({
            email: ['', [Validators.pattern(this.emailRegex)]],
            first_name: ['', [Validators.required, Validators.minLength(2)]],
            last_name: ['', [Validators.required, Validators.minLength(2)]],
            mobile_number: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
            address: ['', [Validators.required]],
            gender: [''],
            dob: [''],
            city: ['', [Validators.required]],
            area: [''],
        });
    }

    ionViewDidEnter() {
        this.storeService.user.subscribe(res => {
            if (Object.getOwnPropertyNames(res).length !== 0) {
                if (!res['isLogged']) {
                    this.storeService.saveRoute('tabs/bag');
                    this.router.navigate(['/auth']);
                    return;
                }
                this.userData = res['data'];
                if (this.userData) {
                    this.setUserDataInForm();
                    this.get_area().then(()=> {
                        this.setCityArea();
                    });
                    this.getAddress(); 
                }
            }
        });
    }

    ionViewWillLeave() {
        this.item = null;
        this.userData = null;
        this.deliveryAddressList = null;
        this.userForm = undefined;
        this.cityList = null;
        this.areaList = null;
    }


    get_area() {
        return new Promise<void>((resolve, reject) => {
            this.sharedService.loadingStart();
            this.httpService.getAreaData().subscribe(res => {
                this.sharedService.loadingClose();
                this.cityList = [];
                this.areaList = [];
                res.forEach(ele => {
                    if (ele.parent_id === 0) {
                        this.cityList.push({id: ele['id'], name: ele['name']});
                    } else if (ele.parent_id === 1) {
                        this.areaList.push({id: ele['id'], name: ele['name']});
                    }
                });
                resolve();
            }, err => {
                this.sharedService.loadingClose();
                //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
                reject();
            });
        })
    }

    saveUserData() {
        const data = {
            first_name: this.userForm.value.first_name ? this.userForm.value.first_name : null,
            last_name: this.userForm.value.last_name ? this.userForm.value.last_name : null,
            email: this.userForm.value.email ? this.userForm.value.email : null,
            mobile_number: this.userForm.value.mobile_number ? this.userForm.value.mobile_number : null,
            gender: this.userForm.value.gender ? this.userForm.value.gender : null,
            dob: this.userForm.value.dob ? this.userForm.value.dob : null,
            address: this.userForm.value.address ? this.userForm.value.address : null,
            city: this.userForm.value.city ? this.userForm.value.city.id : null,
            area: this.userForm.value.area && this.userForm.value.city.id === 1 ? this.userForm.value.area.id : null
        }
        var phoneComponents = {
            IDDCC: data['mobile_number'].substring(0, data['mobile_number'].length - 11), 
            NN: data['mobile_number'].substring(data['mobile_number'].length - 11, data['mobile_number'].length)
        };
        data['mobile_number'] = phoneComponents['NN'];
        this.userForm.markAllAsTouched();
        if (this.userForm.status === 'INVALID') {
            return false;
        } else {
            const UserToken = localStorage.getItem('user_token');
            this.sharedService.loadingStart();
            this.userService.updateUserData(data).subscribe(loginData => {
                this.sharedService.loadingClose();
                if (loginData) {
                    this.sharedService.loadingStart();
                    this.userService.userData(UserToken).subscribe(res => {
                        this.sharedService.loadingClose();
                        this.storeService.updateUser({ isLogged: true, data: res, token: UserToken });
                        this.sharedService.toast('Update Successfully', 2000, 'success');
                    }, err => {
                        this.sharedService.loadingClose();
                        //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
                    });
                }
            }, err => {
                this.sharedService.loadingClose();
                //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
            });
        }
    }


    //For address____________
    getAddress() {
        this.sharedService.loadingStart();
        this.userService.getDeliveryAddress().subscribe(res => {
            this.sharedService.loadingClose();
            this.deliveryAddressList = res;
        }, err => {
            this.sharedService.loadingClose();
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }

    async addAddress() {
        const addAddress = await this.modalCtrl.create({
            component: AddAddressComponent,
            componentProps: {method: 'add'}
        });
        addAddress.onDidDismiss().then((data) => {
            if (data) {
                this.getAddress();
            }
        })
        return await addAddress.present();
    }

    async editAddress(item) {
        const editAddressAlert = await this.alertCtrl.create({
            header: 'Confirmation',
            message: 'Are you sure you want to <b>modify</b> it?',
            buttons: [
                {text: 'Cancel', role: 'cancel'},
                {
                    text: 'Okay',
                    handler: () => {
                        this.alertCtrl.dismiss().then(() => {
                            this.editAddress_(item);
                        });
                    }
                }
            ]
        });
        return await editAddressAlert.present();
    }

    async editAddress_(_data) {
        const editAddress = await this.modalCtrl.create({
            component: AddAddressComponent,
            componentProps: {method: 'edit', data: _data}
        });
        editAddress.onDidDismiss().then((data) => {
            if (data) {
                this.getAddress();
            }
        });
        return await editAddress.present();
    }

    async deleteAddress(addressId) {
        const deleteAddressAlert = await this.alertCtrl.create({
            header: 'Confirmation',
            message: 'Are you sure you want to <b>delete</b> it?',
            buttons: [
                {text: 'Cancel', role: 'cancel'},
                {
                    text: 'Okay',
                    handler: () => {
                        this.alertCtrl.dismiss().then(() => {
                            this.deleteAddress_(addressId);
                        });
                    }
                }
            ]
        });
        return await deleteAddressAlert.present();
    }

    deleteAddress_(id) {
        this.userService.removeDeliveryAddress(id).subscribe(res => {
            this.sharedService.toast(res['msg'], 1000, 'success').then(() => {
                this.getAddress();
            });
        });
    }

    async changePrimaryAddress(val) {
        if (val.primary_address !== 1) {
            const changePrimaryAlert = await this.alertCtrl.create({
                header: 'Confirmation',
                message: 'Are you sure you want to add this address as primary?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                    {
                        text: 'Okay',
                        handler: () => {
                            this.alertCtrl.dismiss().then(() => {
                                this.changePrimaryAddress_(val.id);
                            });
                        }
                    }
                ]
            });
            return await changePrimaryAlert.present();
        }
    }

    changePrimaryAddress_(data) {
        this.userService.changePrimaryAddress(data).subscribe((res) => {
            this.sharedService.toast(res['message'] ? res['message'] : 'Successfully changed your default delivery address', 1000, 'success').then(() => {
                this.getAddress();
            });
        }, err => {
            //this.sharedService.alert('Opps!', 'Something Went Wrong.', 'Please Try Again')
        });
    }


    get f() {
        return this.userForm.controls;
    }

    private setUserDataInForm() {
        this.userForm.patchValue({
            email: this.userData.email,
            first_name: this.userData.first_name,
            last_name: this.userData.last_name,
            mobile_number: this.userData.phone ? this.userData.phone : this.userData.phone2,
            address: this.userData.address,
            gender: this.userData.gender,
            dob: this.userData.dob
        });
    }

    private setCityArea() {
        if(this.userData && this.cityList && this.areaList) {
            // console.log(this.userData)
            if(this.cityList && this.cityList.length > 0) {
                const cityIndex = this.cityList.findIndex(item => item.id === this.userData.city_id);
                if(cityIndex && cityIndex !== -1) {
                    this.userForm.controls['city'].setValue(this.cityList[cityIndex]);
                }
            }
            if(this.areaList && this.areaList.length > 0) {
                const areaIndex = this.areaList.findIndex(item => item.id === this.userData.area_id);
                if(areaIndex && areaIndex !== -1) {
                    this.userForm.controls['area'].setValue(this.areaList[areaIndex]);
                }
            }
        }
    }

    public formatDate(value: any) {
        if(!value) return;
        let date = new Date(new Date(value).setHours(0, 0, 0, 0)).toLocaleDateString();
        this.userForm.get('dob').setValue(date, {onlySelf: true});
        this.userForm.get('dob').updateValueAndValidity();
    }


}
