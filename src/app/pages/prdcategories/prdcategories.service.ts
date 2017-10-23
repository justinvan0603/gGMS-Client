import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { Category } from "./prdcategories";



@Injectable()
export class CategoryService {

  _baseUrl: string = '';
  public _token: string;
  public _pageSize: number;
  constructor(private http: Http,
    private itemsService: ItemsService,
    private configService: ConfigService) {
    this._baseUrl = configService.getApiURI() + 'Category';
  }

  setToken(token: string): void {

    this._token = token;

  }
  set(pageSize?: number): void {

    this._pageSize = pageSize;
  }
  getAllCategories(searchString?: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);
    var uri = this._baseUrl + '/GetAll' + '/' + searchString;
    return this.http.get(uri, {
        headers: headers
      })
      .map((res: Response) => {
          return res.json();
        }
      );
  }
  getCategories(page: number, searchString?: string) {
    //console.log("Bearer "+this._token);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);
    //var uri= this._baseUrl;
    //console.log(page);
    // console.log(this._pageSize);
    //var uri=this._baseUrl + page.toString() + '/' + this._pageSize.toString() + '/' + searchString;
    var uri = this._baseUrl + '/' + page.toString() + '/' + this._pageSize.toString() + '/' + searchString;

    //console.log(uri);
    return this.http.get(uri, {
        headers: headers
      })
      .map(response => (<Response>response));
  }


  getCategory(id: string): Observable<Category> {
    return this.http.get(this._baseUrl + '/GetCategoryById?id=' + id)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }


  updateCategory(category: Category): Observable<any> {
    // console.log(domain);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this._baseUrl + '/' + category.CATEGORY_ID, JSON.stringify(category), {
        headers: headers
      })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  createCategory(category: Category): Observable<any> {
    // console.log(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json,');
    //headers.append('Accept', 'application/json');
    //let data = {'users': user,'domain': user.Domain};
    return this.http.post(this._baseUrl, JSON.stringify(category), { headers: headers })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(this._baseUrl + '/' + id)
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

  public getCategoryTree()
  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);
    var uri = this._baseUrl + '/GetCategoryTree';
    return this.http.get(uri, {
        headers: headers
      })
      .map((res: Response) => {
          return res.json();
        }
      );
  }
}