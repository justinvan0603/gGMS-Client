
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateFormatPipe } from "../shared/pipes/date-format.pipe";
import { HighlightDirective } from "../shared/directives/highlight.directive";
import { MobileHideDirective } from "../shared/directives/mobile-hide.directive";
import { SlimLoadingBarComponent, SlimLoadingBarService } from "ng2-slim-loading-bar";

import { BrowserModule } from "@angular/platform-browser";
import { DatepickerModule, ModalModule, ProgressbarModule, PaginationModule, TimepickerModule } from "ng2-bootstrap";
import { HttpModule } from "@angular/http";
import { ItemsService } from "../shared/utils/items.service";
import { MappingService } from "../shared/utils/mapping.service";
import { NotificationService } from "../shared/utils/notification.service";
import { ConfigService } from "../shared/utils/config.service";

@NgModule({
//   imports: [
//     CommonModule,
//     DatepickerModule.forRoot(),
//     ModalModule.forRoot(),
//     ProgressbarModule.forRoot(),
//     PaginationModule.forRoot(),
//     routing,
//     TimepickerModule.forRoot(),
//   ],
//   declarations: [
//     Messages,
//     MessageListComponent,
//      DateFormatPipe,
//     HighlightDirective,
//     MobileHideDirective,
//     SlimLoadingBarComponent
//   ],
declarations:[DateFormatPipe,
    HighlightDirective,
    MobileHideDirective,
    SlimLoadingBarComponent],
  providers: [
    ConfigService,

    ItemsService,
    MappingService,
    NotificationService,
    SlimLoadingBarService,

  ],
  exports:[DateFormatPipe,
    HighlightDirective,
    MobileHideDirective,
    SlimLoadingBarComponent]
})
export class ShareModule {
}
