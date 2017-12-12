import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { BotDomain } from './botdomain';




@Injectable()
export class BotDomainService {

    _baseUrl: string = '';
    public _token:string;
    public _pageSize: number;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'BotDomain';
    }

    setToken(token:string):void{

      this._token=token;

    }
    set(pageSize?: number): void {
      
        this._pageSize = pageSize;
    }

   getDomains(page: number, searchString? : string)
    {
        //console.log("Bearer "+this._token);
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
     //var uri= this._baseUrl;
     //console.log(page);
    // console.log(this._pageSize);
     //var uri=this._baseUrl + page.toString() + '/' + this._pageSize.toString() + '/' + searchString;
        var uri = this._baseUrl +'/' + page.toString() + '/' + this._pageSize.toString()  + '/' + searchString;

      //console.log(uri);
        return this.http.get(uri, {
          headers: headers
        })
            .map(response => (<Response>response));
    }


    getDomainByUsername(username: string): Observable<BotDomain[]> {
        let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
        return this.http.get(this._baseUrl +'/GetByUsername/'+ username,{headers:headers})
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }


    updateDomain(botDomain: BotDomain): Observable<any> {
       // console.log(domain);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl +'/' + botDomain.DOMAIN_ID, JSON.stringify(botDomain), {
            headers: headers
        })
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    createDomain(botDomain: BotDomain): Observable<any> {
       // console.log(user);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
        //headers.append('Accept', 'application/json');
        //let data = {'users': user,'domain': user.Domain};
        return this.http.post(this._baseUrl, JSON.stringify(botDomain), {headers: headers})
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    deleteDomain(id: number): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
        return this.http.delete(this._baseUrl + '/' + id,{headers:headers})
            .map(res => <any>(<Response>res).json())
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