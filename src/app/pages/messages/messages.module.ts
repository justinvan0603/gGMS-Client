import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from "./messages.routing";

import { MessageListComponent } from "./messages-list.component";

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
import { Messages } from "./messages.component";
import { DataService } from "./message.service";
import { FeatureService } from "./feature.service"
import { ShareModule } from "../shared/shares.module";
import {ReCaptchaModule } from 'angular2-recaptcha';
import {DataShareService} from "../shared/services/dataShare.service";
import {UtilityService} from "../shared/services/utility.service";
import { DomainProfileService } from "./domainprofile.service";
import { LinkNotificationService } from "./linknotification.service";

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
    ReCaptchaModule
  ],
  declarations: [
    Messages,
    MessageListComponent,

    // DateFormatPipe,
   // HighlightDirective,
   // MobileHideDirective,
   // SlimLoadingBarComponent
  ],
  providers: [
   // ConfigService,
    DataService,

   // ItemsService,
   // MappingService,
   // NotificationService,
   // SlimLoadingBarService,
    FeatureService,
    DomainProfileService,
    DataShareService,
    UtilityService,
    LinkNotificationService
  ],
 // exports:[DateFormatPipe]
})
export class MessageModule {
}
