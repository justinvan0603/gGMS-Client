import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import {ApplicationRole} from "../users/applicationRole";
import {MenuRole} from "./menuRole";


@Injectable()
export class MenuService {

    _baseUrl: string = '';
    _token;

    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'MenuRole';
    }

  setToken(tokenUser: string) {
    this._token = tokenUser;

  }

  get(page?: number, itemsPerPage?: number): Observable<PaginatedResult<MenuRole[]>> {
        var peginatedResult: PaginatedResult<MenuRole[]> = new PaginatedResult<MenuRole[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
            headers.append('Authorization','Bearer '+this._token);
        }

        return this.http.get(this._baseUrl, {
            headers: headers
        })
            .map((res: Response) => {
                //console.log(res.headers.keys());
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                    //console.log(paginationHeader);
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }
    getWithSearch(page?: number, itemsPerPage?: number,searchstring?:string): Observable<PaginatedResult<MenuRole[]>> {
        var peginatedResult: PaginatedResult<MenuRole[]> = new PaginatedResult<MenuRole[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
            headers.append('Authorization','Bearer '+this._token);
        }

        return this.http.get(this._baseUrl + '/' + searchstring, {
            headers: headers
        })
            .map((res: Response) => {
                //console.log(res.headers.keys());
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                    //console.log(paginationHeader);
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }


    update(user: MenuRole): Observable<any> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);
        return this.http.put(this._baseUrl,JSON.stringify(user), {
            headers: headers
        })
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    create(usr: MenuRole): Observable<any> {
        //console.log(usr);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);
        return this.http.post(this._baseUrl, JSON.stringify(usr), {
            headers: headers
        })
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    delete(id: number): Observable<any> {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization','Bearer '+this._token);
        return this.http.delete(this._baseUrl +'/'+ id, {
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
