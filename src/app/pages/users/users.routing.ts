import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { UserListComponent } from "./users-list.component";
import { Users } from "./users.component";
import {UserManagerComponent} from "./users-manager.component";
import {ApplicationGroupComponent} from "./users-group.component";
import {ApplicationRoleComponent} from "./users-role.component";

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Users ,
    children: [
      { path: 'userlist', component: UserListComponent },
      { path: 'usergroup', component: ApplicationGroupComponent },
      { path: 'usermanager', component: UserManagerComponent },
      { path: 'userrole', component: ApplicationRoleComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
