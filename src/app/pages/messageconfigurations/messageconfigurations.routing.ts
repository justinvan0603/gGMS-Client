import { Routes, RouterModule }  from '@angular/router';

import { MessageConfigurationsListComponent } from './messageconfigurations-list.component';
import { ModuleWithProviders } from '@angular/core';
import {MessageConfigurations} from './messageconfigurations.component'
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: MessageConfigurations ,
    children: [
      { path: 'messageconfigurationslist', component: MessageConfigurationsListComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
