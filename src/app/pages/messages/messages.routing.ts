import { Routes, RouterModule }  from '@angular/router';

import { MessageListComponent } from './messages-list.component';
import { ModuleWithProviders } from '@angular/core';
import {Messages} from './messages.component'
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Messages ,
    children: [
      { path: 'messagelist', component: MessageListComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
