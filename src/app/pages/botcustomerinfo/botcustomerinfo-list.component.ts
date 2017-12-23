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
import { BotCustomerInfo } from './botcustomerinfo';
import { BotCustomerInfoService } from './botcustomerinfo.service';


@Component({
    // moduleId: module.id,

    selector: 'botcustomerinfos',
    templateUrl: 'botcustomerinfo-list.component.html',

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
    ],styles:[`td
{
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}`]

    
})
export class BotCustomerInfoListComponent extends Paginated implements AfterViewChecked {
    viewPluginForm : NgForm;
    @ViewChild('viewPluginForm') currentForm: NgForm;
    @ViewChild('childModal') public childModal: ModalDirective;
    BotCustomerInfos: BotCustomerInfo[];
    selectedCustomer: BotCustomerInfo;
    apiHost: string;
    public isViewDetail: boolean= false;
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    public searchString : string;
    public addBotCustomerInfo:BotCustomerInfo;
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedBotCustomerInfoId: number;
    selectedBotCustomerInfoLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    public addingBotCustomerInfo: boolean = false;

    formErrors = {
    'PluginCode': '',
    'PluginName' : '',
    'PluginLocation' : '',
    'PluginDescription':'',
    'Price':'',
    'Vat':'',
    'DiscountAmt':'',

  };
  public isValid: boolean = true;
  validationMessages = {
    'PluginCode': {
      'required':      'Mã Plugin không được để trống', 
      'maxlength':     'Mã Plugin phải từ 1-15 ký tự',
    },
    'PluginName': {
      'required':      'Tên Plugin không được để trống', 
      'maxlength':     'Tên Plugin phải từ 1-200 ký tự',
    },
    'PluginLocation': {
      'required':      'Vị trí lưu không được để trống', 
      'maxlength':     'Vị trí lưu phải từ 1-1000 ký tự',
    }
    ,
    'PluginDescription': {
      'maxlength':      'Mô tả phải từ 1-500 ký tự', 
      
    }
    ,
    'Price': {
      'required':      'Giá gốc không được để trống', 
      'pattern':      'Giá gốc không hợp lệ (tối đa 9 chữ số)', 
    }
    ,
    'Vat': {
      'required':      'Vat không được để trống', 
      'pattern':      'Vat không hợp lệ', 
      
    }
    ,
    'DiscountAmt': {
      'required':      'Số tiền giảm giá không được để trống', 
      'pattern':      'Số tiền giảm giá không hợp lệ (tối đa 9 chữ số)', 
    }
  };
    constructor(
        private dataService: BotCustomerInfoService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
 
        private membershipService:MembershipService
        ) { super(0, 0, 0);
            //this.addPlugin = new PrdPlugin(); 
        this.searchString = ''; }

    ngOnInit() {
        this.dataService.set( 12);
        this.apiHost = this.configService.getApiHost();
         this.dataService.setToken(this.membershipService.getTokenUser());
        this.loadPlugins('');
        
       
        //console.log(this.dataService._token);
        
    }

    search(i): void {
    super.search(i);
    if( !this.searchString)
        this.loadPlugins('');
    else
        {
            this._page =0;
            this._pagesCount = 12;
    this.loadPlugins(this.searchString);
        }
  };
    searchitem(searchstring: string)
    {
        
        if(!searchstring)
            searchstring = '';
        super.search(0);
        this.loadPlugins(searchstring);
    }

    loadPlugins(searchString?:string) {
        this.loadingBarService.start();
        var user = this.membershipService.getLoggedInUser();
        this.dataService.getBotCustomerInfos(this._page,searchString,user.Username)
            .subscribe(res => {
                var data: any = res.json();

                this.BotCustomerInfos = data.Items;
                //this._displayingTotal = data.TotalCount;
                //console.log(data.Page);
               // console.log(data.TotalPages);
               // console.log(data.TotalCount);
                this._page = data.Page;
                this._pagesCount = data.TotalPages;
                this._totalCount = data.TotalCount;
            },
            error => {
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
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
            });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
        if(!this.searchString)
            this.loadPlugins('');
        else
            this.loadPlugins(this.searchString);

    };

ngAfterViewChecked(): void {
            this.formChanged();
    }
    formChanged()
    {
         if (this.currentForm === this.viewPluginForm) { return; }
         this.viewPluginForm = this.currentForm;
         if(this.viewPluginForm)
         {
            this.viewPluginForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
         }
    }
    onValueChanged(data?: any)
    {
        if (!this.viewPluginForm) { return; }
        const form = this.viewPluginForm.form;
        this.isValid = true;
        for (const field in this.formErrors) 
        {
            
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) 
            {
               // console.log(field);
                this.isValid = false;
                const messages = this.validationMessages[field];
                for (const key in control.errors) 
                {
                    
                    this.formErrors[field] += messages[key] + ' ';
                   // console.log(this.formErrors[field]);
                }
            }
        }
    }

    

    viewAddPlugin() {
        this.isViewDetail = false;
        this.onEdit = false;
        this.addBotCustomerInfo = new BotCustomerInfo();
        this.selectedCustomer = new BotCustomerInfo();
        this.addingBotCustomerInfo = true;
        this.loadingBarService.complete();
        this.selectedBotCustomerInfoLoaded = true;
        this.childModal.show();

    }
deleteBotCustomerInfo(botCustomerInfo:BotCustomerInfo)
{
    //console.log(domain);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
            () => {
                this.loadingBarService.start();
                this.dataService.deleteBotCustomerInfo(botCustomerInfo.CUSTOMER_ID)
                    .subscribe(rs => {
                        if(rs.Succeeded)
                        {
                            this.notificationService.printSuccessMessage(rs.Message);
                            this.itemsService.removeItemFromArray<BotCustomerInfo>(this.BotCustomerInfos, botCustomerInfo);
                        }
                        else
                        {
                            this.notificationService.printErrorMessage(rs.Message);
                        }
                        
                        //this.notificationService.printSuccessMessage('Xóa domain thành công');
                        this.loadingBarService.complete();
                    },
                    error => {
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
                //         if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                //     this.utilityService.navigateToSignIn();

                // }
                //         this.loadingBarService.complete();
                //         this.notificationService.printErrorMessage('Lỗi ' + ' ' + error);
                    });
            });
}
editBotCustomerInfo(botCustomerInfo: BotCustomerInfo) {
        //console.log(domain);
        
        //console.log(this.selectedManageUser);
        var _user = this.membershipService.getLoggedInUser();
        //this.selectedPlugin.EditorId = _user.Username;
        this.loadingBarService.start();
        this.onEdit = true;
        this.dataService.updateBotCustomerInfo(this.selectedCustomer)
            .subscribe(res => {
                if(res.Succeeded)
                {
                    this.notificationService.printSuccessMessage(res.Message);
                    this.hideChildModal();
                }
                else
                {
                    this.notificationService.printErrorMessage(res.Message);
                }
                //this.notificationService.printSuccessMessage('Domain đã được cập nhật');
                this.loadingBarService.complete();
            },
            error => {
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
                // if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                //     //this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
            });
        }


    
    public viewDetail(botCustomerInfo: BotCustomerInfo)
    {
        this.addingBotCustomerInfo = false;

        this.selectedCustomer = botCustomerInfo;


        this.loadingBarService.complete();
        this.selectedBotCustomerInfoLoaded = true;

        this.childModal.show();
        this.isViewDetail = true;
    }
    public viewBotCustomerInfoDetails(botCustomerInfo: BotCustomerInfo): void {
        this.isViewDetail = false;
        this.addingBotCustomerInfo = false;

        this.selectedCustomer = botCustomerInfo;


        this.loadingBarService.complete();
        this.selectedBotCustomerInfoLoaded = true;

        this.childModal.show();
    }


    public hideChildModal(): void {
        this.childModal.hide();
    }
    
}