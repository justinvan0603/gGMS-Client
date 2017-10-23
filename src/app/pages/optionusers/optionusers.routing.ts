import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';

import { OptionUserListComponent } from "./optionusers-list.component";
import { OptionUsers } from "./optionusers.component";



//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: OptionUsers ,
    children: [
       { path: 'optionuserlist/:domainid', component: OptionUserListComponent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
