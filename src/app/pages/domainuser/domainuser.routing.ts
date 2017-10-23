import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';



import { DomainUsers } from "./domainusercomponent";
import { DomainUserListComponent } from "./domainuser-list.component";



//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: DomainUsers ,
    children: [
       { path: 'domainuserlist/:editeduser', component: DomainUserListComponent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
