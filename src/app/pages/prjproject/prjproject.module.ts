import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {DomainListComponent} from "./domain-list.component";
import {DatepickerModule, ModalModule, PaginationModule, ProgressbarModule, TimepickerModule} from "ng2-bootstrap";
import {Domains} from "./domains.component";

import {ShareModule} from "../shared/shares.module";
import {ManageUserService} from "./manageuser.service";
import {UtilityService} from "../shared/services/utility.service";
import {PrjProject} from "./prjproject.component";
import {PrjProjectComponent} from "./prjproject-list.component";
import {PrjProjectOperatorComponent} from "./prjprojectoperator.component";
import {DataService} from "./prjproject.service";
import {routing} from "./prjproject.routing";
import {UserManagerService} from "../users/user-manager.service";
import {CmAllCodeService as AllCodeService} from "../cmallcode/cmallcode.service";
import {DataService as ContractService} from "../contract/contract.service";
import {PrdProductService} from '../prdproducts/prdproducts.service';
import {PrjProjectOvervieweCommercesComponent} from "./prjproject-overviewecommerces.component";
import {PrjProjectChartComponent} from "./prjproject-chart.component";
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
    PrjProject,
    PrjProjectComponent,
    PrjProjectOperatorComponent,
    PrjProjectOvervieweCommercesComponent,
    PrjProjectChartComponent
  ],
  providers: [
    DataService,
    UtilityService,
    UserManagerService,
    AllCodeService,
    ContractService,
    PrdProductService
  ],
  //exports:[DateFormatPipe]
})

export class PrjProjectModule {
}
