import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { PrdProduct } from "./prdproducts.component";
import { ProductListComponent } from "./prdproducts-list.component";
import { ProductAddComponent } from "./prdproducts-add.component";
import { ProductEditComponent } from "./prdproducts-edit.component";
import { ProductViewComponent } from "./prdproducts-view.component";




//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: PrdProduct ,
    children: [
       { path: 'productslist', component: ProductListComponent},
       { path: 'productadd', component: ProductAddComponent},
       { path: 'productedit/:productid', component: ProductEditComponent},
       { path: 'productview/:productid', component: ProductViewComponent}
       
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
