import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { Message } from "./message";

@Injectable()
export class DataService {

    _baseUrl: string = '';
    public _token:string;
public _pageSize: number;
    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'Messages/';
    }

    setToken(token:string):void{

      this._token=token;

    }
    set(pageSize?: number): void {
      
        this._pageSize = pageSize;
    }

   getMessagesByUsername(page: number, username: string, searchString? : string)
    {
        //console.log("Bearer "+this._token);
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization','Bearer '+this._token);

        var uri = this._baseUrl + page.toString() + '/' + this._pageSize.toString() + '/' + username + '/' + searchString;

      //console.log(uri);
        return this.http.get(uri, {
          headers: headers
        })
            .map(response => (<Response>response));
    }
    getMessages(page?: number, itemsPerPage?: number): Observable<PaginatedResult<Message[]>> {
        var peginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseUrl, {
            headers: headers
        })
            .map((res: Response) => {
               // console.log(res.headers.keys());
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

    getMessage(id: number): Observable<Message> {
        return this.http.get(this._baseUrl + id)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }


    updateMessageRead(message: Message): Observable<any> {
        //console.log(message);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'MessageRead?messageid=' + message.Id, {
            headers: headers
        })
           .map(res => <any>(<Response>res).json())
            .catch(this.handleError);
    }

    // createMessage(user: IMessage): Observable<IMessage> {

    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');

    //     return this.http.post(this._baseUrl, JSON.stringify(user), {
    //         headers: headers
    //     })
    //         .map((res: Response) => {
    //             return res.json();
    //         })
    //         .catch(this.handleError);
    // }

    // deleteMessage(id: number): Observable<void> {
    //     return this.http.delete(this._baseUrl + id)
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