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
import { routing } from "./prdproducts.routing";
import { PrdProduct } from "./prdproducts.component";
import { ProductListComponent } from "./prdproducts-list.component";
import { PrdProductService } from "./prdproducts.service";
import { ProductAddComponent } from "./prdproducts-add.component";
import { ProductEditComponent } from "./prdproducts-edit.component";
import { ProductViewComponent } from "./prdproducts-view.component";
import { SourceService } from "../source/source.service";
import { PluginService } from "../prdplugins/prdplugins.service";
import { TemplateService } from "../prdtemplates/prdtemplates.service";


import { TreeModule } from 'angular-tree-component';
import { CategoryService } from "../prdcategories/prdcategories.service";
import { CmAllCodeService } from "../cmallcode/cmallcode.service";





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
  
TreeModule,
    
    FormsModule,

    // OptionLinkModule

  ],
  declarations: [
    PrdProduct,
    ProductListComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductViewComponent,
    
 
  ],
  providers: [
  
  PrdProductService,
  SourceService,
  PluginService,
  TemplateService,
  UtilityService,
  CategoryService,
  CmAllCodeService,

  ],
  //exports:[DateFormatPipe]
})
export class PrdProductModule {
}
