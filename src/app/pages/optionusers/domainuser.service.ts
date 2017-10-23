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
import { UserDomainUpdateObject } from "./userdomainupdateobject";

@Injectable()
export class DomainUserService {

    _baseUrl: string = '';
    public _token : string;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'Options';
    }
    setToken(token:string):void{

      this._token=token;

    }
   getOption(domain: string)
   {
        let headers = new Headers();
         headers.append('Content-Type', 'application/json');
         headers.append('Authorization','Bearer '+this._token);
         return this.http.get(this._baseUrl + '?domain=' + domain,{headers: headers})
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
   }
   updateUserDomain(option:UserDomainUpdateObject)
   {
            let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);
        return this.http.put(this._baseUrl + '/' + option.OPTION.ID, JSON.stringify(option), {
            headers: headers
        })
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
   }
    // getOptionLinks(domain: string,page?: number, itemsPerPage?: number): Observable<PaginatedResult<Option[]>> {
    //     var peginatedResult: PaginatedResult<Option[]> = new PaginatedResult<Option[]>();

    //     let headers = new Headers();
    //     if (page != null && itemsPerPage != null) {
    //         headers.append('Pagination', page + ',' + itemsPerPage);
    //     }

    //     return this.http.get(this._baseUrl +'?domain=' +domain, {
    //         headers: headers
    //     })
    //         .map((res: Response) => {
    //             console.log(res.headers.keys());
    //             peginatedResult.result = res.json();

    //             if (res.headers.get("Pagination") != null) {
    //                 //var pagination = JSON.parse(res.headers.get("Pagination"));
    //                 var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
    //                 console.log(paginationHeader);
    //                 peginatedResult.pagination = paginationHeader;
    //             }
    //             return peginatedResult;
    //         })
    //         .catch(this.handleError);
    // }




    // updateOptionLink(optionlinks: Option[]): Observable<void> {

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