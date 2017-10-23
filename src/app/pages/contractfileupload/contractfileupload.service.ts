import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService } from "../shared/utils/config.service";
import { ItemsService } from "../shared/utils/items.service";
import { PaginatedResult, Pagination } from "../shared/interfaces";
import {  CmsContractFileUpload } from "./cmscontractfileupload";

@Injectable()
export class DataService
{
  _baseUrl: string = '';
  public _token: string;

  constructor(private http: Http,
    private itemsService: ItemsService,
    private configService: ConfigService
  )
  {
    this._baseUrl = configService.getApiURI() + 'contractuploadfile';
    this._token = '';
  }

  setToken(token: string): void
  {
    this._token = token;
  }

  getContractFileUploads(page?: number, itemsPerPage?: number, searchString?: string): Observable<PaginatedResult<CmsContractFileUpload[]>>
  {
    var peginatedResult: PaginatedResult<CmsContractFileUpload[]> = new PaginatedResult<CmsContractFileUpload[]>();
    //console.log('t-' +this._token);
    let headers = new Headers();
    if (page != null && itemsPerPage != null)
    {
      headers.append('Pagination', page + ',' + itemsPerPage);
    }
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._token);

    return this.http.get(this._baseUrl + '?searchString=' + searchString,
        {
          headers: headers
        })
      .map((res: Response) =>
      {
        // console.log(res.headers.keys());
        peginatedResult.result = res.json();

        if (res.headers.get("Pagination") != null)
        {
          //var pagination = JSON.parse(res.headers.get("Pagination"));
          var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
          // console.log(paginationHeader);
          peginatedResult.pagination = paginationHeader;
        }
        return peginatedResult;
      })
      .catch(this.handleError);
  }

  getContractFileUploadById(id: string, type: string): Observable<any>
  {
      return this.http.get(this._baseUrl + '/getbyid?id=' + id + '&type=' + type)
      .map((res: Response) =>
      {
        return res.json();
      })
      .catch(this.handleError);
  }
    

  updateContractFileUpload(id: string, contractUploadFiles: CmsContractFileUpload[]): Observable<any>
  {
    // console.log(domain);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
 
    return this.http.put(this._baseUrl + '/' + id,
        JSON.stringify(contractUploadFiles),
        {
          headers: headers
        })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);

    //return this.http.put(this._baseUrl +'/' + contractUploadFile.ContractId, JSON.stringify(body), {
    //    headers: headers
    //  })
    //  .map(res => <any>(<Response>res).json())
    //  .catch(this.handleError);
  }

  createContractFileUpload(contractUploadFile: CmsContractFileUpload): Observable<any>
  {
    // console.log(user);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('Accept', 'application/json');
    //let data = {'users': user,'domain': user.Domain};
    //var body = {
    //  'contr': contractUploadFile,
    //  'contr_dt': contractDt
    //};
    return this.http.post(this._baseUrl, JSON.stringify(contractUploadFile), { headers: headers })
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);

    //return this.http.post(this._baseUrl, JSON.stringify(body), {headers: headers})
    //  .map(res => <any>(<Response>res).json())
    //  .catch(this.handleError);
  }

  deleteContract(id: string): Observable<any>
  {
    return this.http.delete(this._baseUrl + '/' + id)
      .map(res => <any>(<Response>res).json())
      .catch(this.handleError);
  }


  UploadContractFileUpload(CONTRACT_ID: string, files: File[]): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();
      formData.append("CONTRACT_ID", CONTRACT_ID);
      
      if (files == null) { formData.append("uploads[]", files) }
      else
        for (let i = 0; i < files.length; i++) {
          formData.append("uploads[]", files[i], files[i].name);

        }
      //{
      //    for (let i = 0; i < files.length;i++) {
      //        if (listFiles.some(n => n.FILE_NAME == files[i].name)) {
      //            formData.append("uploads[]", files[i], files[i].name);
      //        }
      //    }
      //}
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
      var url = this._baseUrl + '/contractuploadfile';
      xhr.open('POST', url, true);
      var serverFileName = xhr.send(formData);

      return xhr.response;
    });
  }


  UploadFiles(CONTRACT_ID: string, files: File[]): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();
      formData.append("CONTRACT_ID", CONTRACT_ID);
      if (files == null) { formData.append("uploads[]", files) }
      else
        for (let i = 0; i < files.length; i++) {
          formData.append("uploads[]", files[i], files[i].name);

        }
      //{
      //    for (let i = 0; i < files.length; i++) {
      //        if (listFiles.some(n => n.FILE_NAME == files[i].name)) {
      //            formData.append("uploads[]", files[i], files[i].name);
      //        }
      //    }
      //}

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
      var url = this._baseUrl + '/uploadfile';
      xhr.open('POST', url, true);
      var serverFileName = xhr.send(formData);

      return xhr.response;
    });
  }

  private handleError(error: any)
  {
    var applicationError = error.headers.get('Application-Error');
    var serverError = error.json();
    var modelStateErrors: string = '';

    if (!serverError.type)
    {
      //  console.log(serverError);
      for (var key in serverError)
      {
        if (serverError[key])
          modelStateErrors += serverError[key] + '\n';
      }
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }
}