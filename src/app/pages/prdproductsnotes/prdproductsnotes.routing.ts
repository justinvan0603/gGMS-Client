import { Routes, RouterModule }  from '@angular/router';

import { ModuleWithProviders } from '@angular/core';

import { PrdProductsNotes } from "./prdproductsnotes.component";
import { ProductNotesListComponent } from "./prdproductsnotes-list.component";
import { ProductNotesEditComponent } from "./prdproductsnotes-edit.component";
import { ProductNotesViewComponent } from "./prdproductsnotes-view.component";

//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: PrdProductsNotes ,
    children: [
       { path: 'productsnoteslist', component: ProductNotesListComponent},
       { path: 'productsnotesedit/:productid', component: ProductNotesEditComponent},
       { path: 'productsnotesview/:productid', component: ProductNotesViewComponent },
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
