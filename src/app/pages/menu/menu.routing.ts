import { Routes, RouterModule }  from '@angular/router';
import {Menu} from "./menu.component";


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Menu
  }
];

export const routing = RouterModule.forChild(routes);


