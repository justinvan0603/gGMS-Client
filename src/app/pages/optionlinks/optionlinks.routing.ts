import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { OptionLinks } from "./optionlinks.component";
import { OptionLinkListComponent } from "./optionlinks-list.component";

//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: OptionLinks ,
    children: [
       { path: 'optionlinklist/:domainid', component: OptionLinkListComponent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
