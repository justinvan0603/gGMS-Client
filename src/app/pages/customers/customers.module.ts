import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';


import { DomainListComponent } from "./domain-list.component";

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
import { Domains } from "./domains.component";

import { ShareModule } from "../shared/shares.module";
import { ManageUserService } from "./manageuser.service";
import { UtilityService } from "../shared/services/utility.service";
import { Customers } from "./customers.component";
import { CustomerListComponent } from "./customers-list.component";
import { DataService } from "./customers.service";
import { routing } from "./customers.routing";
// import { OptionLinkModule } from "./option-link/option-link.module";
//import { OptionLinkComponent } from "./option-link/option-link.component";


@NgModule({
  imports: [
    CommonModule,
    DatepickerModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    PaginationModule.forRoot(),
    routing,
    TimepickerModule.forRoot(),
    ShareModule,
    // OptionLinkModule

  ],
  declarations: [
    Customers,
    CustomerListComponent
 
  ],
  providers: [
  
  DataService,

  UtilityService,
 

  ],
  //exports:[DateFormatPipe]
})
export class CustomerModule {
}
