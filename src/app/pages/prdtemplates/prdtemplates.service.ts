import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import { PrdTemplate } from "./prdtemplates";


@Injectable()
export class TemplateService {
  progress$: any;
  progress: any;
  progressObserver: any;
  _baseUrl: string = '';
  public _token: string;
  public _pageSize: number;
  constructor(private http: Http,
    private itemsService: ItemsService,
    private configService: ConfigService) {
    this._baseUrl = configService.getApiURI() + 'PrdTemplates';

    //     this.progress$ = Observable.create(observer => {
    //   this.progressObserver = observer
    // }).share();
  }



  setToken(token: string): void {

    this._token = token;

  }
  set(pageSize?: number): void {

    this._pageSize = pageSize;
  }
  getAllTemplates(searchstring?: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);
    var uri = this._baseUrl + '/GetAll' + '/' + searchstring;
    return this.http.get(uri, {
      headers: headers
    })
      .map((res: Response) => {
        return res.json();
      }
      );
  }
  getTemplates(page: number, searchString?: string) {
    //console.log("Bearer "+this._token);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);
    //var uri= this._baseUrl;
    //console.log(page);
    // console.log(this._pageSize);
    //var uri=this._baseUrl + page.toString() + '/' + this._pageSize.toString() + '/' + searchString;
    var uri = this._baseUrl + '/' + page.toString() + '/' + this._pageSize.toString() + '/' + searchString;

    //console.log(uri);
    return this.http.get(uri, {
      headers: headers
    })
      .map(response => (<Response>response));
  }
  getTemplateCode(): Observable<Response> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);
    return this.http.get(this._baseUrl + '/GetTemplateCode', { headers: headers })
      .map((res: Response) => {
        return res;
      })
      .catch(this.handleError);
  }

  getTemplate(id: number): Observable<PrdTemplate> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);
    return this.http.get(this._baseUrl + id, { headers: headers })
      .map((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }


  updateTemplate(template: PrdTemplate): Observable<any> {
    // console.log(domain);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);
    return this.http.put(this._baseUrl + '/' + template.TemplateId, JSON.stringify(template), {
      headers: headers
    })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  createTemplate(template: PrdTemplate): Observable<any> {
    // console.log(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json,');
    headers.append('Authorization', 'Bearer ' + this._token);
    //headers.append('Accept', 'application/json');
    //let data = {'users': user,'domain': user.Domain};
    return this.http.post(this._baseUrl, JSON.stringify(template), { headers: headers })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  deleteTemplate(id: string): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json,');
    headers.append('Authorization', 'Bearer ' + this._token);
    return this.http.delete(this._baseUrl + '/' + id, { headers: headers })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }

  updateImageFile(currentImagePath: string, templatecode: string, params: string[], files: File[]): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),
      xhr: XMLHttpRequest = new XMLHttpRequest();
      formData.append("TemplateCode", templatecode);
      formData.append("CurrentImagesPath", currentImagePath);
      if (files == null) { formData.append("uploads[]", files) }
      if (files == null) { formData.append("uploads[]", null) }
      else 
      for (let i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);

      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();

          } else {
            observer.error(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = (event) => {
        // this.progress = Math.round(event.loaded / event.total * 100);

        // this.progressObserver.next(this.progress);
      };
      var url = this._baseUrl + '/UpdateImageFile';
      xhr.open('POST', url, true);
      var serverFileName = xhr.send(formData);

      return xhr.response;
    });
  }

  uploadImageFile(templatecode: string, params: string[], files: File[]): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();
      formData.append("TemplateCode", templatecode);
      for (let i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();

          } else {
            observer.error(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = (event) => {
        // this.progress = Math.round(event.loaded / event.total * 100);

        // this.progressObserver.next(this.progress);
      };
      var url = this._baseUrl + '/PostImageFile';
      xhr.open('POST', url, true);
      var serverFileName = xhr.send(formData);

      return xhr.response;
    });
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