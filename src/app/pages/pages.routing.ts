import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },

  // {
  //   path: 'register',
  //   loadChildren: 'app/pages/register/register.module#RegisterModule'
  // },
  {
    path: 'pages',
    component: Pages,
    children: [

      { path: '', redirectTo: 'login', pathMatch: 'full' },
       //{ path: 'fileupload', loadChildren: 'app/pages/uploadfile/uploadfile.module#UploadFileModule' },
      { path: 'userprofile', loadChildren: 'app/pages/userprofile/userprofile.module#UserProfileModule' },
      { path: 'users', loadChildren: 'app/pages/users/users.module#UserModule' },

//     { path: 'chart', loadChildren: 'app/pages/charts/charts.module#Charts' },


      { path: 'messages', loadChildren: 'app/pages/messages/messages.module#MessageModule' },
      //{ path: 'messageconfigurations', loadChildren: 'app/pages/messageconfigurations/messageconfigurations.module#MessageConfigurationModule' },
     // { path: 'domains', loadChildren: 'app/pages/domains/domains.module#DomainModule' },
     // { path: 'optionlinks', loadChildren: 'app/pages/optionlinks/optionlinks.module#OptionLinkModule' },
      //{ path: 'optionusers', loadChildren: 'app/pages/optionusers/optionusers.module#OptionUserModule' },
//{ path: 'domainuser', loadChildren: 'app/pages/domainuser/domainuser.module#DomainUserModule' },
     // { path: 'tables', loadChildren: 'app/pages/tables/tables.module#TablesModule' },
       //{ path: 'schedules', loadChildren: 'app/pages/schedules/schedules.module#SchedulesModule' },
       { path: 'menurole', loadChildren: 'app/pages/menu/menu.module#MenuModule' },
       { path: 'customers', loadChildren: 'app/pages/customers/customers.module#CustomerModule' },

      { path: 'charts', loadChildren: 'app/pages/charts/charts.module#ChartsModule' },
     { path: 'contract', loadChildren: 'app/pages/contract/contract.module#ContractModule' },

    { path: 'prdproduct',children:[
      { path: '', loadChildren: 'app/pages/prdtemplates/prdtemplates.module#PrdTemplateModule' },
      { path: '', loadChildren: 'app/pages/source/source.module#SourceModule' },
      { path: '', loadChildren: 'app/pages/prdplugins/prdplugins.module#PrdPluginModule' },
      { path: '', loadChildren: 'app/pages/prdproducts/prdproducts.module#PrdProductModule' },
      { path: '', loadChildren: 'app/pages/prdcategories/prdcategories.module#CategoryModule' },
      { path: '', loadChildren: 'app/pages/prdproductsnotes/prdproductsnotes.module#PrdProductsNotesModule' },

     ]
     },
    { path: 'prjproject', loadChildren: 'app/pages/prjproject/prjproject.module#PrjProjectModule' },


    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
