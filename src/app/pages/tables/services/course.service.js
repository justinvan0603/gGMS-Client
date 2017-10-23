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
var Observable_1 = require('rxjs/Observable');
require('rxjs/Rx');
var CourseService = (function () {
    function CourseService(_httpService) {
        this._httpService = _httpService;
        this.apiUrl = 'http://localhost:9823/api/Domains/'; // URL to web API
    }
    CourseService.prototype.getItems = function () {
        return this._httpService.get(this.apiUrl).map(this.extractData).catch(this.handleError);
    };
    CourseService.prototype.getItem = function (id) {
        return this._httpService.get(this.apiUrl + id).map(this.extractData).catch(this.handleError);
    };
    CourseService.prototype.addItem = function (course) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._httpService.post(this.apiUrl, course, options)
            .map(this.extractData).catch(this.handleError);
    };
    CourseService.prototype.editItem = function (course) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._httpService.put(this.apiUrl + course.Id, course, options)
            .map(this.extractData).catch(this.handleError);
    };
    CourseService.prototype.deleteItem = function (id) {
        return this._httpService.delete(this.apiUrl + id)
            .map(this.extractData).catch(this.handleError);
    };
    CourseService.prototype.extractData = function (res) {
        return res.json() || {};
    };
    CourseService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable_1.Observable.throw(errMsg);
    };
    CourseService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], CourseService);
    return CourseService;
}());
exports.CourseService = CourseService;
//# sourceMappingURL=course.service.js.map