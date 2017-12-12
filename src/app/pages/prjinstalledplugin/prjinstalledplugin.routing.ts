import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { PrjInstalledPluginListComponent } from './prjinstalledplugin-list.component';
import { PrjInstalledPlugin } from './prjinstalledplugin.component';







//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: PrjInstalledPlugin ,
    children: [
       { path: 'installedpluginlist', component: PrjInstalledPluginListComponent},

       
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
