import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';

import { Source } from "./source.component";
import { SourceListComponent } from "./source-list.component";


//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Source ,
    children: [
      { path: 'sourcelist', component: SourceListComponent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);


