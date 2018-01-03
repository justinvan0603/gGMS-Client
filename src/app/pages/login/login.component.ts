import {Component, OnInit} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { ConfigService } from '../shared/utils/config.service';
import 'style-loader!./login.scss';
import {User} from "./user";
import {NotificationService} from "../shared/utils/notification.service";
import {Router} from "@angular/router";
import {MembershipService} from "./membership.service";
import {OperationResult} from "./operationResult";
import {OperationTokenResult} from "./operationTokenResult";

@Component({
  selector: 'login',
  templateUrl: './login.html',
})
export class Login implements OnInit {
  private _user: User;

  constructor(public membershipService: MembershipService,
              public notificationService: NotificationService,
              public router: Router) { 
                //console.log(this.membershipService.getLoggedInUser());
                // if(this.membershipService.getLoggedInUser())
                // {
                //   this.router.navigate(['pages/messages/messagelist']);
                // }
              }

  ngOnInit() {
    this._user = new User('', '');
    //console.log(this.membershipService.getLoggedInUser());
    // if(this.membershipService.getLoggedInUser())
    // {
    //   this.router.navigate(['pages/messages/messagelist']);
    // }
    
  }

  login(): void {
    var _authenticationResult: OperationTokenResult = new OperationTokenResult(false, '','','');
   // var token:string;
    this.membershipService.login(this._user)
      .subscribe(res => {
          _authenticationResult.Succeeded = res.Succeeded;
          _authenticationResult.Message = res.Message;
          _authenticationResult.Access_token=res.access_token;
          _authenticationResult.Expires_in =res.expires_in;
         // console.log(_authenticationResult);
          //console.log("a"+res.Succeeded+res.access_token);
        },
        error => console.error('Error: ' + error),
        () => {
         // console.log("ga");
          if (_authenticationResult.Succeeded) {
            this.notificationService.printSuccessMessage('Xin chào, ' + this._user.Username + '!');
            //console.log( _authenticationResult.Access_token);
            localStorage.setItem('user', JSON.stringify(this._user));
            localStorage.setItem('access_token', _authenticationResult.Access_token);
            this.router.navigate(['pages/customers/customerslist']);
          }
          else {
            this.notificationService.printErrorMessage(_authenticationResult.Message);
          }
        });
  };
}
