import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { WebControlCompomnent } from './webcontrol-list.component';
import { WebControl } from './webcontrol.component';








//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: WebControl ,
    children: [
       { path: 'webcontrollist', component: WebControlCompomnent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
