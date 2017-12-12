import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { BotCustomerInfos } from './botcustomerinfo.component';
import { BotCustomerInfoListComponent } from './botcustomerinfo-list.component';







//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: BotCustomerInfos ,
    children: [
       { path: 'botcustomerinfolist', component: BotCustomerInfoListComponent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
