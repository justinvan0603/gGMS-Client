﻿import { NgModule } from '@angular/core';
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
import { Contract } from "./contract.component";
import { ContractListComponent } from "./contract-list.component";
import { ContractOperatorComponent } from "./contractoperator.component";
import { DataService } from "./contract.service";
import { routing } from "./contract.routing";
// import { OptionLinkModule } from "./option-link/option-link.module";
//import { OptionLinkComponent } from "./option-link/option-link.component";

import { DataService as CusService } from "../customers/customers.service";
import { DataService as UserService } from "../users/user.service";
import { PrdProductService as ProService } from "../prdproducts/prdproducts.service"
import { CmAllCodeService as AllCodeService } from "../cmallcode/cmallcode.service";
import { DataService as ContractFileUploadService } from "../contractfileupload/contractfileupload.service"


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
    Contract,
    ContractListComponent,
    ContractOperatorComponent
  ],
  providers: [
    DataService,
    UtilityService,
    CusService, 
    UserService,
    ProService, 
    AllCodeService,
    ContractFileUploadService
  ],
  //exports:[DateFormatPipe]
})
export class ContractModule {
}
