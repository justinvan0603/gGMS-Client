import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



import { UserDomain } from "./userdomain";


import { ItemsService } from "../shared/utils/items.service";
import { ConfigService } from "../shared/utils/config.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";

@Injectable()
export class OptionUserService {

    _baseUrl: string = '';
    public _token : string;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'OptionUser';
    }
   setToken(token:string):void{

      this._token=token;

    }
    getOptionUsers(domain: string): Observable<UserDomain[]> {
        //var peginatedResult: PaginatedResult<Array<UserDomain>> = new PaginatedResult<UserDomain[]>();

        let headers = new Headers();
        // if (page != null && itemsPerPage != null) {
        //     headers.append('Pagination', page + ',' + itemsPerPage);
        // }
        headers.append('Authorization','Bearer '+this._token);
        return this.http.get(this._baseUrl +'?domain=' +domain, {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    // getDomain(id: number): Observable<Optionlink> {
    //     return this.http.get(this._baseUrl + id)
    //         .map((res: Response) => {
    //             return res.json();
    //         })
    //         .catch(this.handleError);
    // }


    // updateOptionLink(optionlinks: Array<Optionlink>): Observable<void> {

    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');

    //     return this.http.post(this._baseUrl, JSON.stringify(optionlinks), {
    //         headers: headers
    //     })
    //         .map((res: Response) => {
    //             return;
    //         })
    //         .catch(this.handleError);
    // }

    // createDomain(user: Optionlink): Observable<Optionlink> {
    //     console.log(user);
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json,');
    //     //headers.append('Accept', 'application/json');
    //     //let data = {'users': user,'domain': user.Domain};
    //     return this.http.post(this._baseUrl, JSON.stringify(user), {headers: headers})
    //         .map((res: Response) => {
    //             return res.json();
    //         })
    //         .catch(this.handleError);
    // }

    // deleteDomain(id: number): Observable<void> {
    //     return this.http.delete(this._baseUrl + id)
    //         .map((res: Response) => {
    //             return;
    //         })
    //         .catch(this.handleError);
    // }

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