import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from "./userprofile.routing";



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
import { ReCaptchaModule } from 'angular2-recaptcha';
import { UserProfile } from "./userprofile.component";
import { UserProfileDetailComponent } from "./userprofile-detail.component";
import { DataService } from "./userprofile.service";
import { ChangePasswordComponent } from "./userprofile-changepassword.component";
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
    ShareModule,
    ReCaptchaModule
  ],
  declarations: [
    UserProfile,
    UserProfileDetailComponent,
    ChangePasswordComponent

  ],
  providers: [

    DataService,
     UtilityService,

  ],
 // exports:[DateFormatPipe]
})
export class UserProfileModule {
}
