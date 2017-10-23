import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';
import { DatepickerModule, ModalModule, ProgressbarModule, PaginationModule, TimepickerModule } from "ng2-bootstrap";
import { DateFormatPipe } from "./pages/shared/pipes/date-format.pipe";
import { HighlightDirective } from "./pages/shared/directives/highlight.directive";
import { MobileHideDirective } from "./pages/shared/directives/mobile-hide.directive";
import { ScheduleEditComponent } from "./pages/schedules/schedule-edit.component";
import { ScheduleListComponent } from "./pages/schedules/schedule-list.component";
import { ConfigService } from "./pages/shared/utils/config.service";
import { ItemsService } from "./pages/shared/utils/items.service";
import { MappingService } from "./pages/shared/utils/mapping.service";
import { NotificationService } from "./pages/shared/utils/notification.service";
import { SlimLoadingBarService, SlimLoadingBarComponent } from "ng2-slim-loading-bar";
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Headers, RequestOptions, BaseRequestOptions} from '@angular/http';
// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState
];


export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
class AppBaseRequestOptions extends BaseRequestOptions {
  headers: Headers = new Headers();

  constructor() {
    super();
    this.headers.append('Content-Type', 'application/json');
    this.body = '';
  }
}

@NgModule({
  bootstrap: [App],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    PagesModule,
    routing,
    // DatepickerModule.forRoot(),
    // ModalModule.forRoot(),
    // ProgressbarModule.forRoot(),
    // PaginationModule.forRoot(),
    // TimepickerModule.forRoot()
  ],
  declarations: [
    App,

    // DateFormatPipe
    //     HighlightDirective,
    //    // HomeComponent,
    //     MobileHideDirective,
    //     ScheduleEditComponent,
    //     ScheduleListComponent,
    //     SlimLoadingBarComponent,
    //  //   UserCardComponent,
    //  //   UserListComponent
  ],

  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    //   ConfigService,
    //   DataService,
    //   ItemsService,
    //   MappingService,
    //  NotificationService,
    //    SlimLoadingBarService

    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: RequestOptions, useClass: AppBaseRequestOptions }
  ],
})


export class AppModule {

  constructor(public appRef: ApplicationRef, public appState: AppState) {
  }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
