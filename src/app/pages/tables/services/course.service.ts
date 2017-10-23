import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

import { ICourse } from './../defines/course.interface';

@Injectable()
export class CourseService {
	private apiUrl = 'http://localhost:9823/api/Domains/';  // URL to web API

	constructor(private _httpService: Http){

	}

	getItems(): Observable<ICourse[]> {
		return this._httpService.get(this.apiUrl).map(this.extractData).catch(this.handleError);
	}

	getItem(id: number): Observable<ICourse> {
		return this._httpService.get(this.apiUrl + id).map(this.extractData).catch(this.handleError);
	}

	addItem(course: ICourse): Observable<ICourse> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
    	let options = new RequestOptions({ headers: headers });

		return this._httpService.post(this.apiUrl, course, options )
								.map(this.extractData).catch(this.handleError);
	}

	editItem(course: ICourse): Observable<ICourse> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
    	let options = new RequestOptions({ headers: headers });

		return this._httpService.put(this.apiUrl + course.Id, course, options)
								.map(this.extractData).catch(this.handleError);
	}

	deleteItem(id: number): Observable<ICourse> {
		return this._httpService.delete(this.apiUrl + id)
								.map(this.extractData).catch(this.handleError);
	}

	private extractData(res: Response) {
		return res.json() || { };
	}

	private handleError (error: Response | any) {

		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}

		return Observable.throw(errMsg);
	}
}