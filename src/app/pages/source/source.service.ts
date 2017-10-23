import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { SourceModel } from "./source";



@Injectable()
export class SourceService {

  _baseUrl: string = '';
  public _token: string;
  constructor(private http: Http,
    private itemsService: ItemsService,
    private configService: ConfigService
  ) {
    this._baseUrl = configService.getApiURI() + 'Sources';
    this._token = '';
  }
  setToken(token: string): void {

    this._token = token;

  }

  getAllSources(searchstring?:string)
    {
        let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
     var uri = this._baseUrl +'/GetAll' + '/' + searchstring;
     return this.http.get(uri, {
          headers: headers
        })
            .map((res: Response)=> {
                return res.json();
                }
            );
    }
  getSources(page?: number, itemsPerPage?: number, searchString?: string): Observable<PaginatedResult<SourceModel[]>> {
    var peginatedResult: PaginatedResult<SourceModel[]> = new PaginatedResult<SourceModel[]>();
    //console.log('t-' +this._token);
    let headers = new Headers();
    if (page != null && itemsPerPage != null) {
      headers.append('Pagination', page + ',' + itemsPerPage);
    }
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);

    return this.http.get(this._baseUrl + '?searchString=' + searchString, {
        headers: headers
      })
      .map((res: Response) => {
        // console.log(res.headers.keys());
        peginatedResult.result = res.json();

        if (res.headers.get("Pagination") != null) {
          //var pagination = JSON.parse(res.headers.get("Pagination"));
          var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
          // console.log(paginationHeader);
          peginatedResult.pagination = paginationHeader;
        }
        return peginatedResult;
      })
      .catch(this.handleError);
  }

  getSource(id: number): Observable<SourceModel> {
    return this.http.get(this._baseUrl + id)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }


  updateSource(sourceModel: SourceModel): Observable<any> {
    // console.log(domain);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this._baseUrl + '/' + sourceModel.SourceId, JSON.stringify(sourceModel), {
        headers: headers
      })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  createSource(sourceModel: SourceModel): Observable<any> {
    // console.log(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json,');
    //headers.append('Accept', 'application/json');
    //let data = {'users': user,'domain': user.Domain};
    return this.http.post(this._baseUrl, JSON.stringify(sourceModel), { headers: headers })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  deleteSource(id: string): Observable<any> {
    return this.http.delete(this._baseUrl + '/' + id)
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  private handleError(error: any) {
    var applicationError = error.headers.get('Application-Error');
    var serverError = error.json();
    var modelStateErrors: string = '';

    if (!serverError.type) {
      //  console.log(serverError);
      for (var key in serverError) {
        if (serverError[key])
          modelStateErrors += serverError[key] + '\n';
      }
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }
}