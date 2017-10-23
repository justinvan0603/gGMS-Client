import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import {Body} from "@angular/http/src/body";
import {MembershipService} from "../../login/membership.service";
@Injectable()
export class DataShareService {

    public _pageSize: number;
    public _baseUri: string;
    public _token:string;
    constructor(public http: Http) {

    }

    set(baseUri: string, pageSize?: number): void {
        this._baseUri = baseUri;
        this._pageSize = pageSize;
    }

    setToken(token:string):void{

      this._token=token;

    }
    getMessagesByUsername(page: number, username: string)
    {
     //   console.log("Bearer "+this._token);
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);

        var uri = this._baseUri + page.toString() + '/' + this._pageSize.toString() + '/' + username;

    //  console.log(uri);
        return this.http.get(uri, {
          headers: headers
        })
            .map(response => (<Response>response));
    }
    get(page: number) {
      //console.log("Bearer "+this._token);
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);

        var uri = this._baseUri + page.toString() + '/' + this._pageSize.toString();

     // console.log(uri);
        return this.http.get(uri, {
          headers: headers
        })
            .map(response => (<Response>response));
    }

    post(data?: any, mapJson: boolean = true) {
     // console.log(data);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
        if (mapJson)
            return this.http.post(this._baseUri, data, {
              headers: headers
            })
                .map(response => <any>(<Response>response).json());
        else
            return this.http.post(this._baseUri, data);
    }

    delete(id: number) {
        return this.http.delete(this._baseUri + '/' + id.toString())
            .map(response => <any>(<Response>response).json())
    }

    deleteResource(resource: string) {
        return this.http.delete(resource)
            .map(response => <any>(<Response>response).json())
    }
}
