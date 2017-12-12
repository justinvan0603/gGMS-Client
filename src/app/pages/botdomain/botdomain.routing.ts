import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { BotDomain } from './botdomain.component';
import { BotDomainListComponent } from './botdomain-list.component';






//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: BotDomain ,
    children: [
       { path: 'botdomainlist', component: BotDomainListComponent},

       
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
