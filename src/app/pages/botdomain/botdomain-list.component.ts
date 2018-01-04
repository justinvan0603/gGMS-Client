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
import { BotDomainService } from './botdomain.service';
import { BotDomain } from './botdomain';


@Component({
    // moduleId: module.id,

    selector: 'botdomains',
    templateUrl: 'botdomain-list.component.html',

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
export class BotDomainListComponent extends Paginated implements AfterViewChecked {
    viewDomainForm : NgForm;
    @ViewChild('viewDomainForm') currentForm: NgForm;
    @ViewChild('childModal') public childModal: ModalDirective;
    listBotDomains: BotDomain[];
    selectedDomain: BotDomain;
    apiHost: string;
    public isViewDetail: boolean= false;
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    public searchString : string;
    public addBotDomain:BotDomain;
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedBotDomainId: number;
    selectedBotDomainLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    public addingBotDomain: boolean = false;
    public stringCode = '';
    formErrors = {
    'DOMAIN': '',

  };
  public isValid: boolean = true;
  validationMessages = {
    'DOMAIN': {
      'required':      'Domain không được để trống', 
      'maxlength':     'Domain phải từ 1-100 ký tự',
    },

  };
    constructor(
        private dataService: BotDomainService,
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
        this.loadBotDomains('');
        
       
        //console.log(this.dataService._token);
        
    }
    ondomainInputChange()
    {
        var domainName = this.selectedDomain.DOMAIN.replace('http://','');
        this.stringCode = `<script>
        function CallWebAPI()
        {
            var scriptResult = document.createElement("script");
            scriptResult.async = true;
            scriptResult.src = "https://WordpressChatBot.azurewebsites.net/api/WebChat?domain=` +domainName + `"; `+
            `scriptResult.charset = 'UTF-8';
            scriptResult.setAttribute('crossorigin', '*');
            scriptResult.setAttribute('Access-Control-Allow-Origin', "*");
            var s0 = document.getElementsByTagName("script")[0];
            s0.parentNode.insertBefore(scriptResult, s0);
        }
        CallWebAPI();
        </script>
        `;
    }

    search(i): void {
    super.search(i);
    if( !this.searchString)
        this.loadBotDomains('');
    else
        {
            this._page =0;
            this._pagesCount = 12;
    this.loadBotDomains(this.searchString);
        }
  };
    searchitem(searchstring: string)
    {
        
        if(!searchstring)
            searchstring = '';
        super.search(0);
        this.loadBotDomains(searchstring);
    }

    loadBotDomains(searchString?:string) {
        this.loadingBarService.start();
        var user = this.membershipService.getLoggedInUser();
        this.dataService.getDomains(this._page,searchString,user.Username)
            .subscribe(res => {
                var data: any = res.json();

                this.listBotDomains = data.Items;
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
            this.loadBotDomains('');
        else
            this.loadBotDomains(this.searchString);

    };

ngAfterViewChecked(): void {
            this.formChanged();
    }
    formChanged()
    {
         if (this.currentForm === this.viewDomainForm) { return; }
         this.viewDomainForm = this.currentForm;
         if(this.viewDomainForm)
         {
            this.viewDomainForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
         }
    }
    onValueChanged(data?: any)
    {
        if (!this.viewDomainForm) { return; }
        const form = this.viewDomainForm.form;
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

    addNewBotDomain(botDomain: BotDomain) {
        var _user = this.membershipService.getLoggedInUser();
        //Plugin.MakerId = _user.Username;
        botDomain.USER_NAME = _user.Username;
        //console.log(botDomain);
        this.loadingBarService.start();
       
        this.dataService.createDomain(botDomain)
            .subscribe(rs=> {
                if(rs.Succeeded)
                {
                    this.notificationService.printSuccessMessage(rs.Message);
                     this.listBotDomains.push(botDomain);
                    this.selectedDomain =new BotDomain();
                    this.loadBotDomains('');
                    this.hideChildModal();
                }
                else
                {
                    this.notificationService.printErrorMessage(rs.Message);
                }
                //this.notificationService.printSuccessMessage('Thêm domain thành công');
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

                //    // this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Lỗi- ' + error);
            });
        }

   //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
            //this.loadSchedules();
    

            viewAddDomain () {
                this.stringCode = '';
        this.isViewDetail = false;
        this.onEdit = false;
        this.addBotDomain = new BotDomain();
        this.selectedDomain = new BotDomain();
        this.addingBotDomain = true;
        this.loadingBarService.complete();
        this.selectedBotDomainLoaded = true;
        this.childModal.show();

    }
    deleteBotDomain(domain:BotDomain)
{
    //console.log(domain);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
            () => {
                this.loadingBarService.start();
                this.dataService.deleteDomain(domain.DOMAIN_ID)
                    .subscribe(rs => {
                        if(rs.Succeeded)
                        {
                            this.notificationService.printSuccessMessage(rs.Message);
                            this.itemsService.removeItemFromArray<BotDomain>(this.listBotDomains, domain);
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
editBotDomain(botDomain: BotDomain) {
       // console.log(botDomain);
        
        //console.log(this.selectedManageUser);
        //var _user = this.membershipService.getLoggedInUser();
        
        this.loadingBarService.start();
        this.onEdit = true;
        this.dataService.updateDomain(botDomain)
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


    
    public viewDetail(botDomain: BotDomain)
    {
        this.addingBotDomain = false;

        this.selectedDomain = botDomain;
        this.stringCode = '';
        var domainName = this.selectedDomain.DOMAIN.replace('http://','');
        //console.log(domainName);
        this.loadingBarService.complete();
        this.selectedBotDomainLoaded = true;
        this.stringCode = `<script>
        function CallWebAPI()
        {
            var scriptResult = document.createElement("script");
            scriptResult.async = true;
            scriptResult.src = "https://WordpressChatBot.azurewebsites.net/api/WebChat?domain=` +domainName + `"; `+
            `scriptResult.charset = 'UTF-8';
            scriptResult.setAttribute('crossorigin', '*');
            scriptResult.setAttribute('Access-Control-Allow-Origin', "*");
            var s0 = document.getElementsByTagName("script")[0];
            s0.parentNode.insertBefore(scriptResult, s0);
        }
        CallWebAPI();
        </script>`;
        this.childModal.show();
        this.isViewDetail = true;
    }
    public viewBotDomainDetails(botDomain: BotDomain): void {
        this.isViewDetail = false;
        this.addingBotDomain = false;
        this.stringCode = '';
        this.selectedDomain = botDomain;
        var domainName = this.selectedDomain.DOMAIN.replace('http://','');
       // console.log(domainName);
        this.stringCode = `<script>
        function CallWebAPI()
        {
            var scriptResult = document.createElement("script");
            scriptResult.async = true;
            scriptResult.src = "https://WordpressChatBot.azurewebsites.net/api/WebChat?domain=` +domainName + `"; `+
            `scriptResult.charset = 'UTF-8';
            scriptResult.setAttribute('crossorigin', '*');
            scriptResult.setAttribute('Access-Control-Allow-Origin', "*");
            var s0 = document.getElementsByTagName("script")[0];
            s0.parentNode.insertBefore(scriptResult, s0);
        }
        CallWebAPI();
        </script>`;
        this.loadingBarService.complete();
        this.selectedBotDomainLoaded = true;

        this.childModal.show();
    }


    public hideChildModal(): void {
        this.childModal.hide();
    }
    
}