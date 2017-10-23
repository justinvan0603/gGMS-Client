import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { Message } from "./message";

@Injectable()
export class DomainProfileService {

    _baseUrl: string = '';
    public _token:string;
public _pageSize: number;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'DomainProfile';
    }

    setToken(token:string):void{

      this._token=token;

    }
    set(pageSize?: number): void {
      
        this._pageSize = pageSize;
    }
getIp(domain: string): Observable<string> {
    let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);

        var uri = this._baseUrl + '/GetIp?domain=' + domain;
        return this.http.get(uri,{headers:headers})
            .map((res: Response) => {
                //console.log(res);
                return res;
            })
            .catch(this.handleError);
    }
//    getIp(domain:string) : Observable<string>
//     {
//         //console.log("Bearer "+this._token);
//      let headers = new Headers();
//      headers.append('Content-Type', 'application/json');
//      headers.append('Authorization','Bearer '+this._token);

//         var uri = this._baseUrl + 'GetIp?domain=' + domain;

//       //console.log(uri);
//         return this.http.get(uri, {
//           headers: headers
//         })
//             .map((res: Response) => {
//                 return res.json();
//             })
//             .catch(this.handleError);
//     }
    
    getNewDomain(oldDomain:string)
    {
        //console.log("Bearer "+this._token);
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);

        var uri = this._baseUrl + '/GetDomain?olddomain=' + oldDomain;

      //console.log(uri);
        return this.http.get(uri, {
          headers: headers
        })
            .map((res: Response) => {
                return res;
            })
            .catch(this.handleError);
    }

    updateProfile(domain:string, type:string): Observable<any>
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl +'?domain=' + domain + '&type=' + type , {
            headers: headers
        })
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    // updateMessage(schedule: IMessage): Observable<void> {

    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');

    //     return this.http.put(this._baseUrl + schedule.Id, JSON.stringify(schedule), {
    //         headers: headers
    //     })
    //         .map((res: Response) => {
    //             return;
    //         })
    //         .catch(this.handleError);
    // }

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