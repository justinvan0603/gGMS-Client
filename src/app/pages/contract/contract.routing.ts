import { Routes, RouterModule } from '@angular/router';


import { ModuleWithProviders } from '@angular/core';

import { Contract } from "./contract.component";
import { ContractListComponent } from "./contract-list.component";
import {ContractOperatorComponent} from "./contractoperator.component";

//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Contract,
    children: [
      { path: 'contractlist', component: ContractListComponent },
      { path: 'contractoperator/:type/:contractId', component: ContractOperatorComponent },
      { path: 'contractoperator/:type/:contractId', component: ContractOperatorComponent },
      { path: 'contractoperator/:type', component: ContractOperatorComponent}
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },

];

export const routing = RouterModule.forChild(routes);
