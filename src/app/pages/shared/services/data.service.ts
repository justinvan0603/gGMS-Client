// import { Injectable } from '@angular/core';
// import { Http, Response, Headers } from '@angular/http';
// //Grab everything with import 'rxjs/Rx';
// import { Observable } from 'rxjs/Observable';
// import {Observer} from 'rxjs/Observer';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
//
// import { IUser, ISchedule, IScheduleDetails, Pagination, PaginatedResult } from '../interfaces';
// import { ItemsService } from '../utils/items.service';
// import { ConfigService } from '../utils/config.service';
// import { IScheduleT } from "../../schedules/schedule.interface";
//
// @Injectable()
// export class DataService {
//
//     _baseUrl: string = '';
//
//     constructor(private http: Http,
//         private itemsService: ItemsService,
//         private configService: ConfigService) {
//         this._baseUrl = configService.getApiURI();
//     }
//
//     getSchedules(page?: number, itemsPerPage?: number): Observable<PaginatedResult<IScheduleT[]>> {
//         var peginatedResult: PaginatedResult<IScheduleT[]> = new PaginatedResult<IScheduleT[]>();
//
//         let headers = new Headers();
//         if (page != null && itemsPerPage != null) {
//             headers.append('Pagination', page + ',' + itemsPerPage);
//         }
//
//         return this.http.get(this._baseUrl + 'Domains', {
//             headers: headers
//         })
//             .map((res: Response) => {
//                 console.log(res.headers.keys());
//                 peginatedResult.result = res.json();
//
//                 if (res.headers.get("Pagination") != null) {
//                     //var pagination = JSON.parse(res.headers.get("Pagination"));
//                     var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
//                     console.log(paginationHeader);
//                     peginatedResult.pagination = paginationHeader;
//                 }
//                 return peginatedResult;
//             })
//             .catch(this.handleError);
//     }
//
//     getSchedule(id: number): Observable<IScheduleT> {
//         return this.http.get(this._baseUrl + 'Domains/' + id)
//             .map((res: Response) => {
//                 return res.json();
//             })
//             .catch(this.handleError);
//     }
//
//
//     updateSchedule(schedule: IScheduleT): Observable<void> {
//
//         let headers = new Headers();
//         headers.append('Content-Type', 'application/json');
//
//         return this.http.put(this._baseUrl + 'Domains/' + schedule.Id, JSON.stringify(schedule), {
//             headers: headers
//         })
//             .map((res: Response) => {
//                 return;
//             })
//             .catch(this.handleError);
//     }
//
//     createSchedule(user: IScheduleT): Observable<IScheduleT> {
//
//         let headers = new Headers();
//         headers.append('Content-Type', 'application/json');
//
//         return this.http.post(this._baseUrl + 'Domains/', JSON.stringify(user), {
//             headers: headers
//         })
//             .map((res: Response) => {
//                 return res.json();
//             })
//             .catch(this.handleError);
//     }
//
//     deleteSchedule(id: number): Observable<void> {
//         return this.http.delete(this._baseUrl + 'Domains/' + id)
//             .map((res: Response) => {
//                 return;
//             })
//             .catch(this.handleError);
//     }
//
//     private handleError(error: any) {
//         var applicationError = error.headers.get('Application-Error');
//         var serverError = error.json();
//         var modelStateErrors: string = '';
//
//         if (!serverError.type) {
//             console.log(serverError);
//             for (var key in serverError) {
//                 if (serverError[key])
//                     modelStateErrors += serverError[key] + '\n';
//             }
//         }
//
//         modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
//
//         return Observable.throw(applicationError || modelStateErrors || 'Server error');
//     }
// }
