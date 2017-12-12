import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';




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


import { ShareModule } from "../shared/shares.module";
import { ManageUserService } from "./manageuser.service";
import { UtilityService } from "../shared/services/utility.service";

import { BotScenario } from './botscenario.component';
import { BotScenarioService } from './botscenario.service';
import { BotQuestionTypeService } from './questiontype.service';
import { BotDomainService } from '../botdomain/botdomain.service';
import { BotScenarioAddComponent } from './botscenario-add.component';
import { BotScenarioListComponent } from './botscenario-list.component';
import { routing } from './botscenario.routing';
import { BotScenarioEditComponent } from './botscenario-edit.component';
import { BotScenarioViewComponent } from './botscenario-view.component';








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
    
    FormsModule,

    // OptionLinkModule

  ],
  declarations: [
    BotScenario,
    BotScenarioAddComponent,
    BotScenarioListComponent,
    BotScenarioEditComponent,
    BotScenarioViewComponent
    
 
  ],
  providers: [
  

  UtilityService,
    BotScenarioService,
    BotQuestionTypeService,
    BotDomainService

  ],
  //exports:[DateFormatPipe]
})
export class BotScenarioModule {
}
