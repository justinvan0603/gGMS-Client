"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var http_2 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
require('rxjs/Rx');
var HttpService = (function () {
    function HttpService(_http) {
        this._http = _http;
        this.API_URL = "http://586f1ade0474f212000b027b.mockapi.io/zendvn/v2/courses";
    }
    HttpService.prototype.getItems = function () {
        return this._http.get(this.API_URL)
            .map(this.extractData)
            .catch(this.handleError);
    };
    HttpService.prototype.getItem = function (id) {
        return this._http.get(this.API_URL + "/" + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    HttpService.prototype.saveItem = function (course) {
        return this._http.post(this.API_URL, course)
            .map(this.extractData)
            .catch(this.handleError);
        //	return this._http.post();
    };
    HttpService.prototype.editItem = function (id, course) {
        return this._http.put(this.API_URL + "/" + id, course)
            .map(this.extractData)
            .catch(this.handleError);
        //	return this._http.post();
    };
    HttpService.prototype.deleteItem = function (id) {
        return this._http.delete(this.API_URL + "/" + id)
            .map(this.extractData)
            .catch(this.handleError);
        //	return this._http.post();
    };
    HttpService.prototype.extractData = function (res) {
        var body = res.json();
        // return body.data || { };
        return body;
    };
    HttpService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_2.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Rx_1.Observable.throw(errMsg);
    };
    HttpService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], HttpService);
    return HttpService;
}());
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map