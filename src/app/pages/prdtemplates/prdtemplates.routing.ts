import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { PrdTemplate } from "./prdtemplates.component";
import { TemplateListComponent } from "./prdtemplates-list.component";





//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: PrdTemplate ,
    children: [
       { path: 'templateslist', component: TemplateListComponent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
