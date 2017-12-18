import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ConfigService} from "../shared/utils/config.service";
import {ItemsService} from "../shared/utils/items.service";
import {PaginatedResult, Pagination} from "../shared/interfaces";
import {PrjProject} from "./prjproject";
import {PrjProjectDt} from "./prjproject-dt";
import {PrjProjectViewModel} from "./prjprojectviewmodel";
import {LookUpProject} from './lookupproject'
import {MyModelGen} from "./mymodelgen";
import {PrjProjectOvervieweCommerces} from "./prjproject-overviewecommerces";
import {PrjProductListPerformanceEcommerce} from "./prjproject-productlist-performancecommerces";
import {PrjProductPageBehaviorCommerces} from "./prjproject-pagebehavior-ecommerces";


@Injectable()
export class DataService {

 // _url103: string = 'http://localhost:60288/api/GenerateSources';
  _url103: string = 'http://103.7.41.51:60289/api/GenerateSources';
  _baseUrl: string = '';
  _baseUrlPrjProjectOvervieweCommerces: string = '';
  _baseUrlPrjProjectProductListPerformanceEcommerce: string = '';
  _baseUrlPrjProjectPageBehaviorEcommerces: string = '';
  public _token: string;

  constructor(private http: Http,
              private itemsService: ItemsService,
              private configService: ConfigService) {
    this._baseUrl = configService.getApiURI() + 'project';
    this._baseUrlPrjProjectOvervieweCommerces = configService.getApiURI() + 'OverviewEcommerceApi';
    this._baseUrlPrjProjectProductListPerformanceEcommerce = configService.getApiURI() + 'ProductListPerformanceEcommerceApi';
    this._token = '';
    this._baseUrlPrjProjectPageBehaviorEcommerces = configService.getApiURI() + 'PageBehaviorEcommerceApi';
  }

  setToken(token: string): void {

    this._token = token;

  }

  getProjects(page?: number, itemsPerPage?: number, searchString?: string): Observable<PaginatedResult<PrjProject[]>> {
    var peginatedResult: PaginatedResult<PrjProject[]> = new PaginatedResult<PrjProject[]>();
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


  filter(data: LookUpProject): Observable<PaginatedResult<PrjProject[]>> {
    var peginatedResult: PaginatedResult<PrjProject[]> = new PaginatedResult<PrjProject[]>();
    //console.log('t-' +this._token);
    let headers = new Headers();
    var page: number = 1;
    var itemsPerPage: number = 10;
    if (page != null && itemsPerPage != null) {
      headers.append('Pagination', page + ',' + itemsPerPage);
    }
    headers.append('Content-Type', 'application/json');

    return this.http.post(this._baseUrl + '/lookup', JSON.stringify(data), {headers: headers})
      .map((res: Response) => {
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

  getByCode(code: string): Observable<PrjProject> {
    return this.http.get(this._baseUrl + '/getbycode?code=' + code)
      .map((res: Response) => {
        return res.json();
      }).catch(this.handleError);
  }

  getById(id: string): Observable<PrjProject> {
    return this.http.get(this._baseUrl + '/GetById?id=' + id)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getProjectDtByProjectId(id: string): Observable<PrjProjectDt[]> {
    return this.http.get(this._baseUrl + '/GetProjectDtByProjectId?id=' + id).map((res: Response) => {
      return res.json();
    }).catch(this.handleError);
  }


  updateProject(prjproject: PrjProject, prjProjectDt: PrjProjectDt[]): Observable<any> {
    // console.log(domain);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var body = {
      'contr': prjproject,
      'contr_dt': prjProjectDt
    };
    var prjVM = new PrjProjectViewModel();
    prjVM.Project = prjproject;
    prjVM.ProjectDT = prjProjectDt;

    console.log(prjVM);

    return this.http.put(this._baseUrl + '/' + prjproject.PROJECT_ID, JSON.stringify(prjVM), {
      headers: headers
    })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);

    //return this.http.put(this._baseUrl +'/' + prjproject.ContractId, JSON.stringify(body), {
    //    headers: headers
    //  })
    //  .map(res => <any>(<Response>res).json())
    //  .catch(this.handleError);
  }

  createProject(prjproject: PrjProject, prjProjectDt: PrjProjectDt[]): Observable<any> {
    // console.log(user);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);
    //headers.append('Accept', 'application/json');
    //let data = {'users': user,'domain': user.Domain};
    //var body = {
    //  'contr': prjproject,
    //  'contr_dt': prjProjectDt
    //};
    var prjVM = new PrjProjectViewModel();
    console.log(prjproject);
    prjVM.Project = prjproject;
    prjVM.ProjectDT = prjProjectDt;


    return this.http.post(this._baseUrl, JSON.stringify(prjVM), {headers: headers})
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);

    //return this.http.post(this._baseUrl, JSON.stringify(body), {headers: headers})
    //  .map(res => <any>(<Response>res).json())
    //  .catch(this.handleError);
  }

  generateSource(myModelGen: MyModelGen): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this._url103, JSON.stringify(myModelGen), {headers: headers})
     
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(this._baseUrl + '/' + id)
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  getPrjProjectOvervieweCommercesById(id: string, page?: number, itemsPerPage?: number, searchString?: string): Observable<PaginatedResult<PrjProjectOvervieweCommerces[]>> {
    var peginatedResult: PaginatedResult<PrjProjectOvervieweCommerces[]> = new PaginatedResult<PrjProjectOvervieweCommerces[]>();

    let headers = new Headers();
    if (page != null && itemsPerPage != null) {
      headers.append('Pagination', page + ',' + itemsPerPage);
    }
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);

    return this.http.get(this._baseUrlPrjProjectOvervieweCommerces + '/GetOverviewEcommerceByProjectId/' + id + '?searchString=' + searchString, {
      headers: headers
    })
      .map((res: Response) => {
        peginatedResult.result = res.json();

        if (res.headers.get("Pagination") != null) {
          var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
          peginatedResult.pagination = paginationHeader;
        }
        return peginatedResult;
      })
      .catch(this.handleError);
  }

  getPrjProjectPageBahaviorEommercesById(id: string, page?: number, itemsPerPage?: number, searchString?: string): Observable<PaginatedResult<PrjProductPageBehaviorCommerces[]>> {
    var peginatedResult: PaginatedResult<PrjProductPageBehaviorCommerces[]> = new PaginatedResult<PrjProductPageBehaviorCommerces[]>();

    let headers = new Headers();
    if (page != null && itemsPerPage != null) {
      headers.append('Pagination', page + ',' + itemsPerPage);
    }
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);

    return this.http.get(this._baseUrlPrjProjectPageBehaviorEcommerces + '/GetPageBehaviorEcommerceByProjectId/' + id + '?searchString=' + searchString, {
      headers: headers
    })
      .map((res: Response) => {
        peginatedResult.result = res.json();

        if (res.headers.get("Pagination") != null) {
          var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
          peginatedResult.pagination = paginationHeader;
        }
        return peginatedResult;
      })
      .catch(this.handleError);
  }

  getPrjProjectProductListPerformanceEcommerceById(id: string, page?: number, itemsPerPage?: number, searchString?: string): Observable<PaginatedResult<PrjProductListPerformanceEcommerce[]>> {
    var peginatedResult: PaginatedResult<PrjProductListPerformanceEcommerce[]> = new PaginatedResult<PrjProductListPerformanceEcommerce[]>();

    let headers = new Headers();
    if (page != null && itemsPerPage != null) {
      headers.append('Pagination', page + ',' + itemsPerPage);
    }
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);

    return this.http.get(this._baseUrlPrjProjectProductListPerformanceEcommerce + '/GetProductListPerformanceEcommerceByProjectId/' + id + '?searchString=' + searchString, {
      headers: headers
    })
      .map((res: Response) => {
        peginatedResult.result = res.json();

        if (res.headers.get("Pagination") != null) {
          var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
          peginatedResult.pagination = paginationHeader;
        }
        return peginatedResult;
      })
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
