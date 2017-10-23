import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { ManageUser } from "./manageuser";

@Injectable()
export class ManageUserService {

    _baseUrl: string = '';

    constructor(private http: Http,
        private itemsService: ItemsService,
        private configService: ConfigService) {
        this._baseUrl = configService.getApiURI()+ 'Users';
    }
   
    // getDomains(page?: number, itemsPerPage?: number): Observable<PaginatedResult<Domain[]>> {
    //     var peginatedResult: PaginatedResult<Domain[]> = new PaginatedResult<Domain[]>();

    //     let headers = new Headers();
    //     if (page != null && itemsPerPage != null) {
    //         headers.append('Pagination', page + ',' + itemsPerPage);
    //     }

    //     return this.http.get(this._baseUrl, {
    //         headers: headers
    //     })
    //         .map((res: Response) => {
    //             console.log(res.headers.keys());
    //             peginatedResult.result = res.json();

    //             if (res.headers.get("Pagination") != null) {
    //                 //var pagination = JSON.parse(res.headers.get("Pagination"));
    //                 var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
    //                 console.log(paginationHeader);
    //                 peginatedResult.pagination = paginationHeader;
    //             }
    //             return peginatedResult;
    //         })
    //         .catch(this.handleError);
    // }

    getManageUsers(parentId?: number, parentUsername?: string): Observable<ManageUser[]> {
        return this.http.get(this._baseUrl + '/GetListByParent?parentid=' + parentId +'&parentname=' + parentUsername )
            .map((res: Response) => {
                return res.json();
            })
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