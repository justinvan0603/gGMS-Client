import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing }       from './uploadfile.routing';

import { FileUpload } from "./uploadfile.component";
import { FileUploadPageComponent } from "./uploadfile-page.component";
import { UploadService } from "./uploadfile.service";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
  ],
  declarations: [
    FileUpload,
    FileUploadPageComponent
  ],
  providers: [ UploadService ]
})
export class UploadFileModule {


}
