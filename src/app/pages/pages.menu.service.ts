import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ItemsService} from "./shared/services/shared/utils/items.service";
import {ConfigService} from "./shared/utils/config.service";

@Injectable()
export class PageMenuService {

    _baseUrl: string = '';
    _token:string;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'MenuRole/getMenuJson';
    }

  setToken(token:string):void{

    this._token=token;

  }

  // getApplicationGroups(page?: number, itemsPerPage?: number): Observable<PaginatedResult<ApplicationGroup[]>> {
  //       var peginatedResult: PaginatedResult<ApplicationGroup[]> = new PaginatedResult<ApplicationGroup[]>();
  //
  //       let headers = new Headers();
  //       if (page != null && itemsPerPage != null) {
  //           headers.append('Pagination', page + ',' + itemsPerPage);
  //       }
  //
  //       return this.http.get(this._baseUrl, {
  //           headers: headers
  //       })
  //           .map((res: Response) => {
  //               console.log(res.headers.keys());
  //               peginatedResult.result = res.json();
  //
  //               if (res.headers.get("Pagination") != null) {
  //                   //var pagination = JSON.parse(res.headers.get("Pagination"));
  //                   var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
  //                   console.log(paginationHeader);
  //                   peginatedResult.pagination = paginationHeader;
  //               }
  //               return peginatedResult;
  //           })
  //           .catch(this.handleError);
  //   }


  getMenu()
  {
  //  console.log("Bearer "+this._token);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization','Bearer '+this._token);

    var uri = this._baseUrl;

  //  console.log(uri);
    return this.http.get(uri, {
      headers: headers
    })
      .map(response => (<Response>response));
  }
}
