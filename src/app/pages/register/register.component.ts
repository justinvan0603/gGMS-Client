import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';

import 'style-loader!./register.scss';
import {DataShareService} from "../shared/services/dataShare.service";
import {NotificationService} from "../shared/services/shared/utils/notification.service";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {MembershipService} from "../login/membership.service";

@Component({
  selector: 'register',
  templateUrl: './register.html',
})
export class Register {

  public form: FormGroup;
  public name: AbstractControl;
  public email: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public passwords: FormGroup;
  private _photosAPI: string = 'http://localhost:9823/api/Account/register';
  public submitted: boolean = false;

  constructor(fb: FormBuilder,
              private dataShareService: DataShareService,
              private notificationService: NotificationService,
              private loadingBarService: SlimLoadingBarService,
              private membershipService:MembershipService,) {

    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  ngOnInit() {

    this.dataShareService.set(this._photosAPI, 12);
    this.dataShareService.setToken(this.membershipService.getTokenUser());



  }
  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.loadingBarService.start();
      this.dataShareService.post(values)
        .subscribe(() => {
            this.notificationService.printSuccessMessage('Thêm User thành công');
            this.loadingBarService.complete();
          },
          error => {
            this.loadingBarService.complete();
            this.notificationService.printErrorMessage('Lỗi- ' + error);
          });
    }
    else {
      this.loadingBarService.start();
      this.loadingBarService.complete();
      this.notificationService.printErrorMessage("Lỗi - Tên miền phải chứa tiền tố 'http://' ");
    }
  }

}
