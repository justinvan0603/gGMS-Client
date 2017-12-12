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
import { WebControlViewModel } from './webcontrolviewmodel';
import { WebControlService } from './webcontrol.service';
import { CmAllCodeService } from '../cmallcode/cmallcode.service';
import { CmAllCode } from '../cmallcode/cmallcode';
import { error } from 'util';


@Component({
    // moduleId: module.id,

    selector: 'webcontrols',
    templateUrl: 'webcontrol-list.component.html',

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
export class WebControlCompomnent extends Paginated implements AfterViewChecked {
    viewPluginForm : NgForm;
    @ViewChild('viewPluginForm') currentForm: NgForm;
    @ViewChild('childModal') public childModal: ModalDirective;
    WebControls: WebControlViewModel[];
    selectedWebControl: WebControlViewModel;
    OperationStateList: CmAllCode[];
    apiHost: string;
    public isViewDetail: boolean= false;
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    public searchString : string;
 //   public addPlugin:WebControlViewModel;
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedPluginId: number;
    selectedPluginLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    public addingPlugin: boolean = false;

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
        private dataService: WebControlService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
 
        private membershipService:MembershipService,
        private cmAllCodeService: CmAllCodeService
        ) { super(0, 0, 0);
           
        this.searchString = ''; }

    ngOnInit() {
        this.dataService.set( 12);
        this.apiHost = this.configService.getApiHost();
         this.dataService.setToken(this.membershipService.getTokenUser());
        this.loadWebControl('');
        this.loadOperationType();
       
        //console.log(this.dataService._token);
        
    }
    loadOperationType()
    {
        
        this.cmAllCodeService.getTypeByCode('OPERATION_STATE').subscribe(
            res => {
                this.OperationStateList = res;
            },
            error=>
            {
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

    search(i): void {
    super.search(i);
    if( !this.searchString)
        this.loadWebControl('');
    else
        {
            this._page =0;
            this._pagesCount = 12;
    this.loadWebControl(this.searchString);
        }
  };
    searchitem(searchstring: string)
    {
        
        if(!searchstring)
            searchstring = '';
        super.search(0);
        this.loadWebControl(searchstring);
    }

    loadWebControl(searchString?:string) {
        this.loadingBarService.start();
        
        this.dataService.getWebControls(this._page,searchString)
            .subscribe(res => {
                var data: any = res.json();

                this.WebControls = data.Items;
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
            this.loadWebControl('');
        else
            this.loadWebControl(this.searchString);

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

    
    

  

updateState(webControl: WebControlViewModel) {
        console.log(webControl);
        
        //console.log(this.selectedManageUser);
        var _user = this.membershipService.getLoggedInUser();
        this.selectedWebControl = webControl;
        this.selectedWebControl.CwWebControl.EDITOR_ID = _user.Username;
        this.loadingBarService.start();
        this.onEdit = true;
        if(this.selectedWebControl.CwWebControl.OPERATION_STATE == '0')
            this.selectedWebControl.CwWebControl.OPERATION_STATE = '1';
        else
        this.selectedWebControl.CwWebControl.OPERATION_STATE = '0';
        this.dataService.updateState(this.selectedWebControl)
            .subscribe(res => {
                if(res.Succeeded)
                {
                    this.notificationService.printSuccessMessage(res.Message);
                    this.dataService.changeStateWebsite(webControl).subscribe(
                        res =>
                        {
                            if(res.isSucceeded == true)
                            {
                                this.notificationService.printSuccessMessage(res.Message);
                            }
                            else
                            {
                                this.notificationService.printErrorMessage(res.Message);
                            }
                        },
                        error =>
                        {
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


    
    

    
}