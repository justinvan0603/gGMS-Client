import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';
import { IDomain } from "./domain.interface";


@Injectable()
export class SmartTablesService {
  private apiUrl = 'http://localhost:9823/api/Domains/';  // URL to web API

	constructor(private _httpService: Http){

	}

	getItems(): Observable<IDomain[]> {
		return this._httpService.get(this.apiUrl).map(this.extractData).catch(this.handleError);
	}

	getItem(id: number): Observable<IDomain> {
		return this._httpService.get(this.apiUrl + id).map(this.extractData).catch(this.handleError);
	}

	addItem(course: IDomain): Observable<IDomain> {
		console.log(course);
		
		let headers = new Headers({ 'Content-Type': 'application/json' });
    	let options = new RequestOptions({ headers: headers });

		return this._httpService.post(this.apiUrl, course, options )
								.map(this.extractData).catch(this.handleError);
	}

	editItem(course: IDomain): Observable<IDomain> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
    	let options = new RequestOptions({ headers: headers });

		return this._httpService.put(this.apiUrl + course.Id, course, options)
								.map(this.extractData).catch(this.handleError);
	}

	deleteItem(id: number): Observable<IDomain> {
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

	metricsTableData = [
    {
      image: 'app/browsers/chrome.svg',
      browser: 'Google Chrome',
      visits: '10,392',
      isVisitsUp: true,
      purchases: '4,214',
      isPurchasesUp: true,
      percent: '45%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/firefox.svg',
      browser: 'Mozilla Firefox',
      visits: '7,873',
      isVisitsUp: true,
      purchases: '3,031',
      isPurchasesUp: false,
      percent: '28%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/ie.svg',
      browser: 'Internet Explorer',
      visits: '5,890',
      isVisitsUp: false,
      purchases: '2,102',
      isPurchasesUp: false,
      percent: '17%',
      isPercentUp: false
    },
    {
      image: 'app/browsers/safari.svg',
      browser: 'Safari',
      visits: '4,001',
      isVisitsUp: false,
      purchases: '1,001',
      isPurchasesUp: false,
      percent: '14%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/opera.svg',
      browser: 'Opera',
      visits: '1,833',
      isVisitsUp: true,
      purchases: '83',
      isPurchasesUp: true,
      percent: '5%',
      isPercentUp: false
    }
  ];
}
