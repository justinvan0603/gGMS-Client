import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from "./users.routing";

import { UserListComponent } from "./users-list.component";

import { DateFormatPipe } from "../shared/pipes/date-format.pipe";
import { HighlightDirective } from "../shared/directives/highlight.directive";
import { MobileHideDirective } from "../shared/directives/mobile-hide.directive";
import { SlimLoadingBarComponent, SlimLoadingBarService } from "ng2-slim-loading-bar";
import { Ckeditor } from "../editors/components/ckeditor/ckeditor.component";
import { Editors } from "../editors/editors.component";
import { BrowserModule } from "@angular/platform-browser";
import { DatepickerModule, ModalModule, ProgressbarModule, PaginationModule, TimepickerModule } from "ng2-bootstrap";
import { HttpModule } from "@angular/http";
import { ItemsService } from "../shared/utils/items.service";
import { MappingService } from "../shared/utils/mapping.service";
import { NotificationService } from "../shared/utils/notification.service";
import { ConfigService } from "../shared/utils/config.service";
import { Users } from "./users.component";
import { DataService } from "./user.service";
import { ShareModule } from "../shared/shares.module";
import {UserManagerService} from "./user-manager.service";
import {UserManagerComponent} from "./users-manager.component";
import {UserGroupService} from "./user-group.service";
import {ApplicationGroupComponent} from "./users-group.component";
import {ApplicationRoleComponent} from "./users-role.component";
import {UserRoleService} from "./user-role.service";
import { ChecklistDirective } from 'ng2-checklist';
import { UtilityService } from "../shared/services/utility.service";

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
    Users,
    UserListComponent,
    UserManagerComponent,
    ApplicationGroupComponent,
    ApplicationRoleComponent

   // HighlightDirective,
  //  MobileHideDirective,
  //  SlimLoadingBarComponent
  ],
  providers: [
  //  ConfigService,
  DataService,
    UserManagerService,
    UserGroupService,
    UserRoleService,
    UtilityService,
  //  ItemsService,
   // MappingService,
   // NotificationService,
   // SlimLoadingBarService,

  ],

  //exports:[DateFormatPipe]
})
export class UserModule {
}
