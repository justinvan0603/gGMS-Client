import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from "./schedules.routing";
import { ScheduleEditComponent } from "./schedule-edit.component";
import { ScheduleListComponent } from "./schedule-list.component";
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
import { Schedules } from "./schedules.component";
import { DataService } from "./schedules.service";


@NgModule({
  imports: [
    CommonModule,
    DatepickerModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    PaginationModule.forRoot(),
    routing,
    TimepickerModule.forRoot(),
  ],
  declarations: [
    Schedules,
    ScheduleListComponent,
    DateFormatPipe,
    HighlightDirective,
    MobileHideDirective,
    SlimLoadingBarComponent
  ],
  providers: [
    ConfigService,
    DataService,
    ItemsService,
    MappingService,
    NotificationService,
    SlimLoadingBarService
  ],
})
export class SchedulesModule {
}
