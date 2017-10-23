import { Http, Response, Request } from '@angular/http';
import { Injectable } from '@angular/core';
import {User} from "./user";
import {Registration} from "./registration";
import { DataShareService } from "../shared/services/dataShare.service";
import { ConfigService } from "../shared/utils/config.service";

@Injectable()
export class MembershipService {

    // private _accountRegisterAPI: string = 'http://localhost:9823/api/account/register/';
    // private _accountLoginAPI: string = 'http://localhost:9823/api/account/authenticate/';
    // private _accountLogoutAPI: string = 'http://localhost:9823/api/account/logout/';

    private _accountRegisterAPI: string;
    private _accountLoginAPI: string;
    private _accountLogoutAPI: string;
    constructor(public accountService: DataShareService,public configService: ConfigService) { 
        this._accountRegisterAPI = this.configService.getApiURI()+ 'account/register/';
        this._accountLoginAPI = this.configService.getApiURI()+ 'account/authenticate/';
        this._accountLogoutAPI = this.configService.getApiURI()+ 'account/logout/';
    }

    register(newUser: Registration) {

        this.accountService.set(this._accountRegisterAPI);

        return this.accountService.post(JSON.stringify(newUser));
    }

    login(creds: User) {
        this.accountService.set(this._accountLoginAPI);
        return this.accountService.post(JSON.stringify(creds));
    }

    logout() {
        this.accountService.set(this._accountLogoutAPI);
        return this.accountService.post(null, false);
        // .subscribe(res => {
            
        //   localStorage.removeItem('user');
        //   localStorage.removeItem('access_token');
      
        // },
        // error => console.error('Error: ' + error),
        // () => { });
    }

    isUserAuthenticated(): boolean {
        var _user: any = localStorage.getItem('user');
        if (_user != null)
            return true;
        else
            return false;
    }

    getLoggedInUser(): User {
        var _user: User;

        if (this.isUserAuthenticated()) {
            var _userData = JSON.parse(localStorage.getItem('user'));
            _user = new User(_userData.Username, _userData.Password);
        }

        return _user;
    }

  getTokenUser(): string {
    var _token: string;

    if (this.isUserAuthenticated()) {
      _token = localStorage.getItem('access_token');
    }

    return _token;
  }
}
