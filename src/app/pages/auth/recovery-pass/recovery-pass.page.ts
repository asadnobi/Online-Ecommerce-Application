import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from '../../../_helpers/must-match.validator';
import { SharedService } from '../../../services/shared.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-pass',
  templateUrl: './recovery-pass.page.html',
  styleUrls: ['./recovery-pass.page.scss'],
})
export class RecoveryPassPage implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,20}$/;

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    public fb: FormBuilder,
    public router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.pattern(this.emailRegex)]],
      password: ['', [Validators.required, Validators.minLength(6)]], // if need password strong Validators.pattern(this.passwordRegex)
      confirmPassword: ['', [Validators.required]]
    },{
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit() {
  }

  changePass(data){
    this.submitted = true;
    if(this.form.status === "VALID") {
      this.router.navigate(['/tabs/home']);
      // this.sharedService.loadingStart();
      // this.userService.forgetPassEmailSend(data).subscribe(result => {
      //   if(result) {
      //     this.sharedService.loadingClose();
      //     this.sharedService.toast('Update Successfully', 2000);
      //   }
      // });
    }
  }

  get f() { return this.form.controls; }

}
