import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



//import { Option } from "./option";


import { ItemsService } from "../shared/utils/items.service";
import { ConfigService } from "../shared/utils/config.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
//import { OptionLinkUpdateObject } from "./optionupdateobject";

import { DomainUserUpdateObject } from "./domainuserupdateobject";
import { PrjInstalledPluginViewModel } from './prjinstalledpluginviewmodel';

@Injectable()
export class PluginDistributionService {
  //  _url103: string = 'http://localhost:60288/api/PluginDistribution';
    _url103: string = 'http://103.7.41.51:60289/api/PluginDistribution';
    _baseUrl: string = '';
    public _token : string;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'PluginDistribution';
    }
    setToken(token:string):void{

      this._token=token;

    }

   distributePlugin(listInstalledPlugin : PrjInstalledPluginViewModel[]):Observable<any>
   {
            let headers = new Headers();
            //var body = {listPrjInstalledPlugin: listInstalledPlugin};

        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);
        return this.http.post(this._url103, JSON.stringify(listInstalledPlugin), {
            headers: headers
        })
        .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
   }


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