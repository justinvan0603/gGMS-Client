import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing }       from './menu.routing';
import {Menu} from "./menu.component";
import {DataShareService} from "../shared/services/dataShare.service";
import {MembershipService} from "../login/membership.service";
import {NotificationService} from "../shared/services/shared/utils/notification.service";
import {ConfigService} from "../shared/services/shared/utils/config.service";
import {MenuService} from "./menu-role.service";
import {ShareModule} from "../shared/shares.module";
import {DatepickerModule, ModalModule, PaginationModule, ProgressbarModule, TimepickerModule} from "ng2-bootstrap";
import {UserGroupService} from "../users/user-group.service";
import {UserRoleService} from "../users/user-role.service";
import {UtilityService} from "../shared/services/utility.service";


@NgModule({
  imports: [
    CommonModule,
    DatepickerModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    PaginationModule.forRoot(),
    routing,
    TimepickerModule.forRoot(),
    ShareModule
  ],
  declarations: [
    Menu
  ],
  providers: [
    MenuService,
   // DataService,
    MembershipService,
    NotificationService,
    ConfigService,
    UserGroupService,
    UserRoleService,
    UtilityService,
  ]
})
export class MenuModule {}
