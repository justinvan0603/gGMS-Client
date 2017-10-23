import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { PrdPlugin } from "./prdplugins";



@Injectable()
export class PluginService {

    _baseUrl: string = '';
    public _token:string;
    public _pageSize: number;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'PrdPlugins';
    }

    setToken(token:string):void{

      this._token=token;

    }
    set(pageSize?: number): void {
      
        this._pageSize = pageSize;
    }
getAllPlugins(searchString?:string)
    {
        let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
     var uri = this._baseUrl +'/GetAll' +'/' + searchString;
     return this.http.get(uri, {
          headers: headers
        })
            .map((res: Response)=> {
                return res.json();
                }
            );
    }
   getPlugins(page: number, searchString? : string)
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


    getPlugin(id: number): Observable<PrdPlugin> {
        let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
        return this.http.get(this._baseUrl + id,{headers:headers})
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }


    updatePlugin(plugin: PrdPlugin): Observable<any> {
       // console.log(domain);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl +'/' + plugin.PluginId, JSON.stringify(plugin), {
            headers: headers
        })
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    createPlugin(plugin: PrdPlugin): Observable<any> {
       // console.log(user);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
        //headers.append('Accept', 'application/json');
        //let data = {'users': user,'domain': user.Domain};
        return this.http.post(this._baseUrl, JSON.stringify(plugin), {headers: headers})
            .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    deletePlugin(id: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);
        return this.http.delete(this._baseUrl + '/' + id,{headers:headers})
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