import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';

import { Customers } from "./customers.component";
import { CustomerListComponent } from "./customers-list.component";

//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Customers ,
    children: [
       { path: 'customerslist', component: CustomerListComponent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
