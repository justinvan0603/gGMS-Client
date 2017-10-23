import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    _apiURI : string;

    constructor() {
        this._apiURI = 'http://103.7.41.51:9823/api/';
     }

     getApiURI() {
         return this._apiURI;
     }

     getApiHost() {
         return this._apiURI.replace('api/','');
     }
}
