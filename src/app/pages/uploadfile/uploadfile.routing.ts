import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { FileUpload } from "./uploadfile.component";
import { FileUploadPageComponent } from "./uploadfile-page.component";



// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: FileUpload ,
    children: [
      { path: '', component: FileUploadPageComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
