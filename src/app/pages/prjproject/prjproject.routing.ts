import { Routes, RouterModule } from '@angular/router';


import { ModuleWithProviders } from '@angular/core';

import { PrjProject } from "./prjproject.component";
import { PrjProjectComponent } from "./prjproject-list.component";
import {PrjProjectOperatorComponent} from "./prjprojectoperator.component";

//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: PrjProject,
    children: [
      { path: 'prjprojectlist', component:  PrjProjectComponent},
      { path: 'prjprojectoperator/:type/:projectId', component: PrjProjectOperatorComponent },
      { path: 'prjprojectoperator/:type/:projectId', component: PrjProjectOperatorComponent },
      { path: 'prjprojectoperator/:type', component: PrjProjectOperatorComponent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },

];

export const routing = RouterModule.forChild(routes);
