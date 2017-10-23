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
import { Domain } from "./domain";
import { DataService } from "./domains.service";
import { ManageUser } from "./manageuser";
import { ManageUserService } from "./manageuser.service";
import { NgForm } from "@angular/forms";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";

@Component({
    // moduleId: module.id,

    selector: 'domains',
    templateUrl: 'domain-list.component.html',

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
    
})
export class DomainListComponent implements AfterViewChecked {
    viewDomainForm : NgForm;
    @ViewChild('viewDomainForm') currentForm: NgForm;
    @ViewChild('childModal') public childModal: ModalDirective;
    domains: Domain[];
    selectedDomain: Domain;
    apiHost: string;
    public listManageUser: ManageUser[];
    public selectedManageUser: ManageUser;
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    public searchString : string;
    public addDomain:Domain;
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedDomainId: number;
    selectedDomainLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    public addingDomain: boolean = false;
    public static DOMAIN_PREFIX = "http://";
    public static DOMAIN_PREFIX_HTTPS = "https://";
    formErrors = {
    'DOMAIN': '',
    'DESCRIPTION' : ''
 
  };
  public isValid: boolean = true;
  validationMessages = {
    'DOMAIN': {
      'required':      'Tên miền không được để trống', 
      'maxlength':     'Tên miền phải từ 1-200 ký tự',
    },
    'DESCRIPTION': {
      'required':      'Mô tả không được để trống', 
      'maxlength':     'Mô tả phải từ 1-200 ký tự',
    }
  };
    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        private manageUserService: ManageUserService,
        private membershipService:MembershipService
        ) {this.addDomain = new Domain(); 
        this.searchString = ''; }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
         this.dataService.setToken(this.membershipService.getTokenUser());
        this.loadDomains('');
        this.loadManageUsers();
       
        //console.log(this.dataService._token);
        
    }
    search(searchstring: string)
    {
        
        this.loadDomains(searchstring);
    }
    loadManageUsers()
    {
        var _user = this.membershipService.getLoggedInUser();
        //console.log(_user);
        this.manageUserService.getManageUsers(null,_user.Username).subscribe((data:ManageUser[]) => {
                this.listManageUser = data;
                //console.log(data);
                //console.log(this.listManageUser);
                this.loadingBarService.complete();
                this.selectedManageUser = this.listManageUser[this.listManageUser.length-1];
            },
            error => {
                
                if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    this.utilityService.navigateToSignIn();

                }
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Có lỗi khi tải .- ' + error);
            });
            
    }
    loadDomains(searchString?:string) {
        this.loadingBarService.start();
        var _user = this.membershipService.getLoggedInUser();
        this.dataService.getDomains(this.currentPage, this.itemsPerPage,searchString,_user.Username)
            .subscribe((res: PaginatedResult<Domain[]>) => {
                this.domains = res.result;// schedules;
                this.totalItems = res.pagination.TotalItems;
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
            });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
        if(!this.searchString)
            this.loadDomains('');
        else
            this.loadDomains(this.searchString);

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
                this.isValid = false;
                const messages = this.validationMessages[field];
                for (const key in control.errors) 
                {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
    addNewDomain(domain: Domain) {
        if(domain.DOMAIN.includes(DomainListComponent.DOMAIN_PREFIX) || domain.DOMAIN.includes(DomainListComponent.DOMAIN_PREFIX_HTTPS))
        {
        //console.log(domain);
        this.loadingBarService.start();
        domain.USER_ID = this.selectedManageUser.Id.toString();
        domain.USERNAME = this.selectedManageUser.UserName;
        domain.FULLNAME = this.selectedManageUser.FULLNAME;
        domain.CREATE_DT = domain.EDIT_DT = domain.APPROVE_DT = null;
        this.dataService.createDomain(domain)
            .subscribe(rs=> {
                if(rs.Succeeded)
                {
                    this.notificationService.printSuccessMessage(rs.Message);
                     this.domains.push(domain);
                    this.addDomain =new Domain();
                    this.loadDomains('');
                }
                else
                {
                    this.notificationService.printErrorMessage(rs.Message);
                }
                //this.notificationService.printSuccessMessage('Thêm domain thành công');
                this.loadingBarService.complete();
                
               
            },
            error => {
                if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                   // this.utilityService.navigateToSignIn();

                }
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Lỗi- ' + error);
            });
        }
        else
        {
            this.loadingBarService.start();
            this.loadingBarService.complete();
                this.notificationService.printErrorMessage("Lỗi - Tên miền phải chứa tiền tố 'http://' hoặc 'https://' ");
        }
   //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
            //this.loadSchedules();
    }

    viewAddDomain() {
        this.onEdit = false;
        this.addDomain = new Domain();
        this.selectedDomain = new Domain();
        this.addingDomain = true;
        this.loadingBarService.complete();
        this.selectedDomainLoaded = true;
        this.childModal.show();

    }
deleteDomain(domain:Domain)
{
    //console.log(domain);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
            () => {
                this.loadingBarService.start();
                this.dataService.deleteDomain(domain.ID)
                    .subscribe(rs => {
                        if(rs.Succeeded)
                        {
                            this.notificationService.printSuccessMessage(rs.Message);
                            this.itemsService.removeItemFromArray<Domain>(this.domains, domain);
                        }
                        else
                        {
                            this.notificationService.printErrorMessage(rs.Message);
                        }
                        
                        //this.notificationService.printSuccessMessage('Xóa domain thành công');
                        this.loadingBarService.complete();
                    },
                    error => {
                        if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    this.utilityService.navigateToSignIn();

                }
                        this.loadingBarService.complete();
                        this.notificationService.printErrorMessage('Lỗi ' + ' ' + error);
                    });
            });
}
editDomain(domain: Domain) {
        //console.log(domain);
        if(domain.DOMAIN.includes(DomainListComponent.DOMAIN_PREFIX)){
        //console.log(this.selectedManageUser);
        this.selectedDomain.USER_ID =this.selectedManageUser.Id.toString();
        this.selectedDomain.USERNAME = this.selectedManageUser.UserName;
        this.loadingBarService.start();
        this.onEdit = true;
        this.dataService.updateDomain(this.selectedDomain)
            .subscribe(res => {
                if(res.Succeeded)
                {
                    this.notificationService.printSuccessMessage(res.Message);
                }
                else
                {
                    this.notificationService.printErrorMessage(res.Message);
                }
                //this.notificationService.printSuccessMessage('Domain đã được cập nhật');
                this.loadingBarService.complete();
            },
            error => {
                if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    //this.utilityService.navigateToSignIn();

                }
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
            });
        }
        else
        {
            this.loadingBarService.start();
            this.loadingBarService.complete();
                this.notificationService.printErrorMessage("Lỗi - Tên miền phải chứa tiền tố 'http://' ");
        }

    }

    public viewDomainDetails(domain: Domain): void {
        this.addingDomain = false;
        //this.selectedUser = new Domain();
        this.selectedDomain = domain;
        //this.selectedDomain.APPROVE_DT = new Date();
        //this.selectedDomain.EDIT_DT = new Date();
        //this.selectedDomain.CREATE_DT = new Date();
        //this.selectedDomain.CHECKER_ID = '';
        //this.selectedDomain.EDITOR_ID = '';
        //this.selectedDomain.MAKER_ID = '';
        //this.selectedDomain.FULLNAME = '';
        //console.log(this.selectedDomain);
        this.selectedManageUser = this.listManageUser.find(val => val.UserName == domain.USERNAME);
        //alert(this.addingUser);
        this.loadingBarService.complete();
        this.selectedDomainLoaded = true;

        this.childModal.show();
    }


    public hideChildModal(): void {
        this.childModal.hide();
    }
}