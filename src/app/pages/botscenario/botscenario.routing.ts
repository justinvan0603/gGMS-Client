import { Routes, RouterModule }  from '@angular/router';


import { ModuleWithProviders } from '@angular/core';
import { BotScenario } from './botscenario.component';
import { BotScenarioListComponent } from './botscenario-list.component';
import { BotScenarioAddComponent } from './botscenario-add.component';
import { BotScenarioEditComponent } from './botscenario-edit.component';
import { BotScenarioViewComponent } from './botscenario-view.component';





//import { OptionLinkComponent } from "./option-link/option-link.component";
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: BotScenario ,
    children: [
       { path: 'botscenariolist', component: BotScenarioListComponent},
       { path: 'botscenarioadd', component: BotScenarioAddComponent},
       { path: 'botscenarioedit/:scenarioid', component: BotScenarioEditComponent},
       { path: 'botscenarioview/:scenarioid', component: BotScenarioViewComponent}
       
    ]
  },
  // { path: 'optionlinks/:domainid', component: OptionLinkComponent },
  
];

export const routing = RouterModule.forChild(routes);
