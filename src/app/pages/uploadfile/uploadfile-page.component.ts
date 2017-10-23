import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';


import {UploadService} from "./uploadfile.service";

@Component({
  selector: 'uploadpage',
  templateUrl: 'uploadfile-page.component.html',
  
})
export class FileUploadPageComponent {
  picName: string;
  constructor(private service:UploadService) {
    this.service.progress$.subscribe(
      data => {
        console.log('progress = '+data);
      });
  }

  onChange(event) {
    console.log('onChange');
    var files = event.srcElement.files;
    
    console.log(files);
    this.service.makeFileRequest('http://localhost:9823/api/UploadFile', [],      files).subscribe(() => {
      console.log("sent");
      this.picName = "ga";
    });
  }
}
