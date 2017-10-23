import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { UserProfile } from "./userprofile.component";
import { UserProfileDetailComponent } from "./userprofile-detail.component";
import { ChangePasswordComponent } from "./userprofile-changepassword.component";

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component:  UserProfile,
    children: [
      { path: 'profiledetail', component: UserProfileDetailComponent },
      { path: 'changepassword', component: ChangePasswordComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
