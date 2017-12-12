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
export class PrjInstalledPluginService {

    _baseUrl: string = '';
    public _token : string;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'PrjInstalledPlugin';
    }
    setToken(token:string):void{

      this._token=token;

    }
   getInstalledPlugins(pluginid: string)
   {
        let headers = new Headers();
         headers.append('Content-Type', 'application/json');
         headers.append('Authorization','Bearer '+this._token);
         return this.http.get(this._baseUrl +'/' + pluginid ,{headers: headers})
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
   }
   insertInstalledPlugins(listInstalledPlugin : PrjInstalledPluginViewModel[])
   {
            let headers = new Headers();
           // var body = {listPrjInstalledPlugin: listInstalledPlugin};

        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);
        return this.http.post(this._baseUrl, JSON.stringify(listInstalledPlugin), {
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