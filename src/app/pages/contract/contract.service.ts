import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { ContractModel } from "./contract";
import { ContractDetail } from "./contract-dt";
import { ContractViewModel } from "./contractviewmodel";

@Injectable()
export class DataService {

  _baseUrl: string = '';
  public _token:string;
  constructor(private http: Http,
    private itemsService: ItemsService,
    private configService: ConfigService
  ) {
    this._baseUrl = configService.getApiURI()+ 'Contract';
    this._token = '';
  }
  setToken(token:string):void{
        
    this._token=token;

  }
  getContracts(page?: number, itemsPerPage?: number, searchString?:string): Observable<PaginatedResult<ContractModel[]>> {
    var peginatedResult: PaginatedResult<ContractModel[]> = new PaginatedResult<ContractModel[]>();
    //console.log('t-' +this._token);
    let headers = new Headers();
    if (page != null && itemsPerPage != null) {
      headers.append('Pagination', page + ',' + itemsPerPage);
    }
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization','Bearer '+this._token);

    return this.http.get(this._baseUrl +'?searchString=' +searchString, {
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

  getByCode(code: string): Observable<ContractModel> {
    return this.http.get(this._baseUrl + '/getbycode?code=' + code)
      .map((res : Response) => {
        return res.json();
      }).
      catch(this.handleError);
  }

  getContract(id: string): Observable<ContractModel> {
    return this.http.get(this._baseUrl + '/GetContactById?id=' + id)
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getContractDtByContractId(id: string): Observable<ContractDetail[]> {
    return this.http.get(this._baseUrl + '/GetContractDtByContractId?id=' + id).map((res:
      Response) => {
      return res.json();
    }).catch(this.handleError);
  }


  updateContract(contract: ContractModel, contractDt : ContractDetail[]): Observable<any> {
    // console.log(domain);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var body = {
      'contr': contract,
      'contr_dt' : contractDt
    };
    var contractVM = new ContractViewModel();
    contractVM.Contract = contract;
    contractVM.ContractDetails = contractDt;

    console.log(contractVM);

    return this.http.put(this._baseUrl + '/' + contract.ContractId, JSON.stringify(contractVM), {
        headers: headers
      })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);

    //return this.http.put(this._baseUrl +'/' + contract.ContractId, JSON.stringify(body), {
    //    headers: headers
    //  })
    //  .map(res => <any>(<Response>res).json())
    //  .catch(this.handleError);
  }

  createContract(contract: ContractModel, contractDt :  ContractDetail[]): Observable<any> {
    // console.log(user);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('Accept', 'application/json');
    //let data = {'users': user,'domain': user.Domain};
    //var body = {
    //  'contr': contract,
    //  'contr_dt': contractDt
    //};
    var contractVM = new ContractViewModel();
    contractVM.Contract = contract;
    contractVM.ContractDetails = contractDt;



    return this.http.post(this._baseUrl, JSON.stringify(contractVM), { headers: headers })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);

    //return this.http.post(this._baseUrl, JSON.stringify(body), {headers: headers})
    //  .map(res => <any>(<Response>res).json())
    //  .catch(this.handleError);
  }

  deleteContract(id: string): Observable<any> {
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
  filter(data: ContractModel) : Observable<PaginatedResult<ContractModel[]>> {
    var peginatedResult: PaginatedResult<ContractModel[]> = new PaginatedResult<ContractModel[]>();
    //console.log('t-' +this._token);
    let headers = new Headers();
    var page: number = 1;
    var itemsPerPage: number = 10;
    if (page != null && itemsPerPage != null) {
      headers.append('Pagination', page + ',' + itemsPerPage);
    }
    headers.append('Content-Type', 'application/json');

    return this.http.post(this._baseUrl + '/lookup', JSON.stringify(data), { headers: headers })
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
}
