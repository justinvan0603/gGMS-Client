import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { UserConfig } from "./messageconfigurations";

@Injectable()
export class DataService {

    _baseUrl: string = '';
    public _token:string;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'UserConfigs';
        this._token = '';
    }
   private extractData(res: Response) {
		return res.json() || { };
	}
    setToken(token:string):void{

      this._token=token;

    }
    getUserConfigs(username:string): Observable<UserConfig[]> {
       // var peginatedResult: PaginatedResult<UserConfig[]> = new PaginatedResult<UserConfig[]>();
       // let headers = new Headers();
       // if (page != null && itemsPerPage != null) {
       //     headers.append('Pagination', page + ',' + itemsPerPage);
       // }
       let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
    // console.log('t-' + this._token);
        return this.http.get(this._baseUrl+'/' + username,{headers:headers})
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserConfig(id: number): Observable<UserConfig> {
        return this.http.get(this._baseUrl + id)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }


    updateUserConfigs(username:string,userconfig: UserConfig[]): Observable<void> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);
        return this.http.put(this._baseUrl + '/'+username, JSON.stringify(userconfig), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    // createMessage(user: IMessage): Observable<IMessage> {

    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');

    //     return this.http.post(this._baseUrl, JSON.stringify(user), {
    //         headers: headers
    //     })
    //         .map((res: Response) => {
    //             return res.json();
    //         })
    //         .catch(this.handleError);
    // }

    // deleteMessage(id: number): Observable<void> {
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
           // console.log(serverError);
            for (var key in serverError) {
                if (serverError[key])
                    modelStateErrors += serverError[key] + '\n';
            }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return Observable.throw(applicationError || modelStateErrors || 'Server error');
    }
}