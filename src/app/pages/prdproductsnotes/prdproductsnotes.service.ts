import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { PrdProductNotes } from "./prdproductsnotes";
import { PrdProductNotesViewModel } from "./prdproductnotesviewmodel";



@Injectable()
export class PrdProductNotesService {

    _baseUrl: string = '';
    public _token:string;
    public _pageSize: number;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'PrdProductsNotes';
    }

    setToken(token:string):void{

      this._token=token;

    }

    getProductCode():Observable<Response>
    {
      let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
     return this.http.get(this._baseUrl + '/GetProductCode',{headers:headers})
     .map((res: Response) => {
                return res;
            })
            .catch(this.handleError);
    }
    generateSourceCode(product:PrdProductNotes):Observable<any>
    {
        let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
     var uri = this._baseUrl +'/GenerateSourcecode';
     return this.http.post(uri,JSON.stringify(product),{headers:headers})
     .map(res => <any>(<Response>res).json())
            .catch(this.handleError);

    }
    set(pageSize?: number): void {
      
        this._pageSize = pageSize;
    }
    getAllProducts(searchstring?:string):Observable<PrdProductNotes[]>
    {
        let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
     var uri = this._baseUrl + '/GetAll' + '/' + searchstring;
     return this.http.get(uri, {
          headers: headers
        })
            .map((res:Response) =>{
                return res.json();
            } ).catch(this.handleError);
    }



   getProducts(page: number, searchString? : string)
    {
        //console.log("Bearer "+this._token);
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
     //var uri= this._baseUrl;
     //console.log(page);
    // console.log(this._pageSize);
     //var uri=this._baseUrl + page.toString() + '/' + this._pageSize.toString() + '/' + searchString;
        var uri = this._baseUrl +'/' + page.toString() + '/' + this._pageSize.toString()  + '/' + searchString;

      //console.log(uri);
        return this.http.get(uri, {
          headers: headers
        })
            .map(response => (<Response>response));
    }
  
   getProduct(id: string): Observable<PrdProductNotesViewModel> {
        let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
        return this.http.get(this._baseUrl + '/GetProductById/' + id,{
          headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
   }

    getProductFullDetail(id:string): Observable<PrdProductNotesViewModel>
    {
         let headers = new Headers();
          headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);
        return this.http.get(this._baseUrl +'/GetProductById/' + id,{headers: headers})
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    updateProduct(productViewModel: PrdProductNotesViewModel): Observable<any> {
       // console.log(domain);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);
        //console.log(productViewModel);
        return this.http.put(this._baseUrl +'/' + productViewModel.PrdProduct.ProductId, JSON.stringify(productViewModel), {
            headers: headers
        })
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }
  

    deleteProduct(id: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization','Bearer '+this._token);
        return this.http.delete(this._baseUrl + '/' + id,{headers: headers})
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