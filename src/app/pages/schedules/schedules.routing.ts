import { Routes, RouterModule }  from '@angular/router';

import { Editors } from './editors.component';
import { Ckeditor } from './components/ckeditor/ckeditor.component';
import { ScheduleListComponent } from "./schedule-list.component";
import { ScheduleEditComponent } from "./schedule-edit.component";
import { Schedules } from "./schedules.component";

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Schedules,
    children: [
      { path: 'schedules', component: ScheduleListComponent },
   //   { path: 'schedules/:id/edit', component: ScheduleEditComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
