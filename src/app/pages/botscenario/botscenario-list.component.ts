import {
    Component, OnInit, ViewChild, Input, Output,
    trigger,
    state,
    style,
    animate,
    transition, AfterViewChecked
  } from '@angular/core';
  import { Router } from '@angular/router';
  import { ModalDirective } from 'ng2-bootstrap';
  import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
  
  // import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
  import { ItemsService } from '../shared/utils/items.service';
  import { ConfigService } from '../shared/utils/config.service';
  import { Pagination, PaginatedResult } from '../shared/interfaces';
  import { NotificationService } from "../shared/utils/notification.service";
  // import { Domain } from "./domain";
  
  // import { ManageUser } from "./manageuser";
  // import { ManageUserService } from "./manageuser.service";
  import { NgForm } from "@angular/forms";
  import { MembershipService } from "../login/membership.service";
  import { UtilityService } from "../shared/services/utility.service";
  
  
  
  
  import { Paginated } from "../messages/paginated";
  import { PrdProduct } from "./prdproducts";
  import { PrdProductService } from "./prdproducts.service";

import { BotScenarioService } from './botscenario.service';
import { BotScenario } from './botscenario';
  
  @Component({
    // moduleId: module.id,
  
    selector: 'botscenarios',
    templateUrl: 'botscenario-list.component.html',
  
    animations: [
      trigger('flyInOut', [
        state('in', style({ opacity: 1, transform: 'translateX(0)' })),
        transition('void => *', [
          style({
            opacity: 0,
            transform: 'translateX(-100%)'
          }),
          animate('0.5s ease-in')
        ]),
        transition('* => void', [
          animate('0.2s 10 ease-out', style({
            opacity: 0,
            transform: 'translateX(100%)'
          }))
        ])
      ])
    ],
    styles: [`td
  {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }`]
  })
  export class BotScenarioListComponent extends Paginated {
    //viewTemplateForm : NgForm;
    //@ViewChild('viewTemplateForm') currentForm: NgForm;
    //@ViewChild('childModal') public childModal: ModalDirective;
    BotScenarios: BotScenario[];
    selectedBotScenario: BotScenario;
    apiHost: string;
  
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    public searchString: string;
  
    // Modal properties
  
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
  
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    isPublished: boolean = false;
  
  
    constructor(
      private dataService: BotScenarioService,
      private itemsService: ItemsService,
      private notificationService: NotificationService,
      private configService: ConfigService,
      public utilityService: UtilityService,
      private loadingBarService: SlimLoadingBarService,
  
      private membershipService: MembershipService
    ) {
      super(0, 0, 0);
  
      this.searchString = '';
      
    }
  
    ngOnInit() {
      this.dataService.set(12);
      this.apiHost = this.configService.getApiHost();
      this.dataService.setToken(this.membershipService.getTokenUser());
      this.loadScenarios('');
     
    }
  
    search(i): void {
      super.search(i);
      if (!this.searchString)
        this.loadScenarios('');
      else
        {
          
          this._page =0;
          this._pagesCount = 12;
          //this._totalCount = 0;
          this.loadScenarios(this.searchString);
        }
    };
    searchitem(searchstring: string) {
      if (!searchstring)
        searchstring = '';
      super.search(0);
      this.loadScenarios(searchstring);
    }
  
    loadScenarios(searchString?: string) {
      this.loadingBarService.start();
      
      this.dataService.getScenarios(this._page, searchString)
        .subscribe(res => {
          this.loadingBarService.complete();
          var data: any = res.json();
  
          this.BotScenarios = data.Items;
          //this._displayingTotal = data.TotalCount;
          this._page = data.Page;
          this._pagesCount = data.TotalPages;
          this._totalCount = data.TotalCount;
          
        },
        error => {
          this.loadingBarService.complete();
          //console.log(error);
          if(error.status == 404)
            {
              this.utilityService.navigateToSignIn();
              this.notificationService.printErrorMessage('Vui lòng đăng nhập tài khoản để xác thực!');
            }
            else if(error.status == 403 || error.status == 401)
              {
                this.utilityService.navigateToSignIn();
                this.notificationService.printErrorMessage('Bạn không có quyền truy cập vào chức năng này!');
              }
              else
                {this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);}
          
          
        });
       
    }
  
    pageChanged(event: any): void {
      this.currentPage = event.page;
      if (!this.searchString)
        this.loadScenarios('');
      else
        this.loadScenarios(this.searchString);
  
    };
    changeState(id: number)
    {
      this.dataService.changeState(id).subscribe(
        rs=>{
            if(rs.Succeeded)
            {
                this.notificationService.printSuccessMessage(rs.Message);
               
                 
            }
            else
            {
                this.notificationService.printErrorMessage(rs.Message);
            }
            //this.notificationService.printSuccessMessage('Thêm domain thành công');
            this.loadingBarService.complete();
        },
        error=>{
            this.loadingBarService.complete();
            if(error.status == 404)
                {
                  this.utilityService.navigateToSignIn();
                  this.notificationService.printErrorMessage('Vui lòng đăng nhập tài khoản để xác thực!');
                }
                else if(error.status == 403 || error.status == 401)
                  {
                    this.utilityService.navigateToSignIn();
                    this.notificationService.printErrorMessage('Bạn không có quyền truy cập vào chức năng này!');
                  }
                  else
                    {this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);}
  
        }
    );
    }

    deleteBotScenario(botScenario: BotScenario) {
      //console.log(domain);
      this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
        () => {
          this.loadingBarService.start();
          this.dataService.deleteScenario(botScenario.SCENARIO_ID)
            .subscribe(rs => {
              if (rs.Succeeded) {
                this.notificationService.printSuccessMessage(rs.Message);
                this.itemsService.removeItemFromArray<BotScenario>(this.BotScenarios, botScenario);
              }
              else {
                this.notificationService.printErrorMessage(rs.Message);
              }
  
              //this.notificationService.printSuccessMessage('Xóa domain thành công');
              this.loadingBarService.complete();
            },
            error => {
              if(error.status == 404)
                {
                  this.utilityService.navigateToSignIn();
                  this.notificationService.printErrorMessage('Vui lòng đăng nhập tài khoản để xác thực!');
                }
                else if(error.status == 403 || error.status == 401)
                  {
                    this.utilityService.navigateToSignIn();
                    this.notificationService.printErrorMessage('Bạn không có quyền truy cập vào chức năng này!');
                  }
                  else
                    {this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);}
            });
        });
    }
  
  }