import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { User } from "./user";
import {UserManager} from "./user-manager";
import {ApplicationGroup} from "./applicationGroup";

@Injectable()
export class UserManagerService {

    _baseUrl: string = '';
    _token;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'ApplicationUser';
    }
    setToken(tokenUser: string) {
      this._token = tokenUser;

    }
    getUsers(page?: number, itemsPerPage?: number): Observable<PaginatedResult<UserManager[]>> {
        var peginatedResult: PaginatedResult<UserManager[]> = new PaginatedResult<UserManager[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
            headers.append('Authorization','Bearer '+this._token);
        }

        return this.http.get(this._baseUrl, {
            headers: headers
        })
            .map((res: Response) => {
            //    console.log(res.headers.keys());
              //console.log("ga"+res);
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                  //s  console.log(paginationHeader);
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }
    getUsersWithSearch(page?: number, itemsPerPage?: number,searchstring?:string): Observable<PaginatedResult<UserManager[]>> {
        var peginatedResult: PaginatedResult<UserManager[]> = new PaginatedResult<UserManager[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
            headers.append('Authorization','Bearer '+this._token);
        }

        return this.http.get(this._baseUrl + '/' + searchstring, {
            headers: headers
        })
            .map((res: Response) => {
            //    console.log(res.headers.keys());
              //console.log("ga"+res);
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                  //s  console.log(paginationHeader);
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }



  getGroupsByUser(page?: number, itemsPerPage?: number, id?:string): Observable<PaginatedResult<ApplicationGroup[]>> {
    var peginatedResult: PaginatedResult<ApplicationGroup[]> = new PaginatedResult<ApplicationGroup[]>();

    let headers = new Headers();
    if (page != null && itemsPerPage != null) {
      headers.append('Pagination', page + ',' + itemsPerPage);
      headers.append('Authorization','Bearer '+this._token);
    }

    return this.http.get(this._baseUrl+ '/detail?id=' + id, {
      headers: headers
    })
      .map((res: Response) => {
        //    console.log(res.headers.keys());
       // console.log("ga"+res);
        peginatedResult.result = res.json();

        if (res.headers.get("Pagination") != null) {
          var pagination = JSON.parse(res.headers.get("Pagination"));
          var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
          //s  console.log(paginationHeader);
          peginatedResult.pagination = paginationHeader;
        }
        return peginatedResult;
      })
      .catch(this.handleError);
  }

  getUser(id: number): Observable<UserManager> {
        return this.http.get(this._baseUrl + id)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
  }


  getByUserName(userName: string): Observable<UserManager> {
    return this.http.get(this._baseUrl + '/getuserbyusername?userName=' + userName).
      map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

    updateUser(user: UserManager): Observable<any> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);

        return this.http.put(this._baseUrl, JSON.stringify(user), {
            headers: headers
        })
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    createUser(usr: UserManager): Observable<any> {
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

    deleteUser(id: string): Observable<any> {
      let headers = new Headers();
      headers.append('Authorization','Bearer '+this._token);
        return this.http.delete(this._baseUrl +'/?id='+ id, {
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
