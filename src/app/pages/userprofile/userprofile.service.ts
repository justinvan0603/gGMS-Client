import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { User } from "../users/user";
import { ChangePasswordObject } from "./changepasswordobject";
import { ApplicationUser } from "./applicationuser";


@Injectable()
export class DataService {

    _baseUrl: string = '';
    _changePasswordUrl : string = '';
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'ApplicationUser';
        this._changePasswordUrl = configService.getApiURI() + 'Account/'
    }

    getUser(userid: string, username:string): Observable<ApplicationUser> {
        return this.http.get(this._baseUrl + '/GetUserById?userid='+userid + '&username=' + username)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
changePassword(username: string, currentpassword :string, newpassword : string): Observable<any>
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var changepass = new ChangePasswordObject();
        changepass.UserName = username;
        changepass.OldPassword = currentpassword;
        changepass.NewPassword = newpassword;
        return this.http.put(this._changePasswordUrl +'/changePassword',JSON.stringify(changepass), {
            headers: headers
        })
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    updateUser(user: User): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl +'/'+ user.Id, JSON.stringify(user), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

   

    private handleError(error: any) {
        var applicationError = error.headers.get('Application-Error');
        var serverError = error.json();
        var modelStateErrors: string = '';

        if (!serverError.type) {
            //console.log(serverError);
            for (var key in serverError) {
                if (serverError[key])
                    modelStateErrors += serverError[key] + '\n';
            }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return Observable.throw(applicationError || modelStateErrors || 'Server error');
    }
}