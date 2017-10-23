import {
    Component, OnInit, ViewChild, Input, Output,
    trigger,
    state,
    style,
    animate,
    transition, AfterViewChecked
} from '@angular/core';

import { ModalDirective } from 'ng2-bootstrap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

// import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ActivatedRoute } from '@angular/router';

//import { Optionlink } from "./optionlink";
//import { OptionLinkService } from "./optionlinks.service";
import { ItemsService } from "../shared/utils/items.service";
import { NotificationService } from "../shared/utils/notification.service";
import { ConfigService } from "../shared/utils/config.service";
import { PaginatedResult } from "../shared/interfaces";
import { UserDomain } from "./userdomain";
import { OptionSearchObject } from "../optionlinks/optionsearch";
// import { OptionLinkService } from "../optionlinks/optionlinks.service";
import { OptionService } from "../optionlinks/option.service";
import { OptionLinkUpdateObject } from "../optionlinks/optionupdateobject";
import { UserDomainUpdateObject } from "./userdomainupdateobject";
import { OptionUserService } from "./optionusers.service";
import { DomainUserService } from "./domainuser.service";
import { ManageUserService } from "../domains/manageuser.service";
import { ManageUser } from "../domains/manageuser";
import { NgForm } from "@angular/forms";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";


@Component({
    // moduleId: module.id,

    selector: 'optionusers',
    templateUrl: 'optionusers-list.component.html',
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
    ]
})
export class OptionUserListComponent  implements AfterViewChecked{
    //@ViewChild('childModal') public childModal: ModalDirective;
    userdomains: Array<UserDomain>;
    selecteduserDomain: UserDomain;
    domainid : string;
    apiHost: string;
    currentOptionSearch : OptionSearchObject;
    addOptionForm : NgForm;
    @ViewChild('addOptionForm') currentForm: NgForm;
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    public listManageUser: ManageUser[];
    public addUserDomain:UserDomain;
    public selectedManageUser: ManageUser;
    // Modal properties
    //@ViewChild('modal')
   // modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    //selectedDomainId: number;
    //selectedDomainLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
   // public addingDomain: boolean = false;
    formErrors = {
        'NOTES': ''
 
    };
    public isValid: boolean = true;
    validationMessages = {
    'NOTES': {
      'required':      'Mô tả không được để trống', 
      'maxlength':     'Mô tả phải từ 1-500 ký tự',
        }
    };
    constructor(
        private dataService: OptionUserService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        private route: ActivatedRoute,
        private domainUserService: DomainUserService,
        private manageUserService : ManageUserService,
        private membershipService:MembershipService

        ) {this.addUserDomain = new UserDomain();  }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.route.params.subscribe(params => {this.domainid=params['domainid']});
        this.dataService.setToken(this.membershipService.getTokenUser());
        this.domainUserService.setToken(this.membershipService.getTokenUser());
        this.loadDomainUser();
        this.loadOption();
        this.loadManageUsers();
        
    }
    ngAfterViewChecked(): void {
            this.formChanged();
    }
    formChanged()
    {
         if (this.currentForm === this.addOptionForm) { return; }
         this.addOptionForm = this.currentForm;
         if(this.addOptionForm)
         {
            this.addOptionForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
         }
    }
    onValueChanged(data?: any)
    {
        if (!this.addOptionForm) { return; }
        const form = this.addOptionForm.form;
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
    loadManageUsers()
    {
        var _user = this.membershipService.getLoggedInUser();
        this.manageUserService.getManageUsers(null,_user.Username).subscribe((data:ManageUser[]) => {
                this.listManageUser = data;
                //console.log(this.listManageUser);
                this.loadingBarService.complete();
            },
            error => {
                if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    this.utilityService.navigateToSignIn();

                }
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Có lỗi khi tải .- ' + error);
            });
    }
    loadOption()
    {
        this.domainUserService.getOption(this.domainid).subscribe((data: OptionSearchObject)=>{
            this.currentOptionSearch = data;
        },
        error => {
                 this.loadingBarService.complete();
               this.notificationService.printErrorMessage('Có lỗi khi tải .- ' + error);
                }
        );
    }
    saveOption()
    {
        if(this.userdomains.length == 0)
        {
            this.notificationService.printErrorMessage("Lỗi: Phải có ít nhất một user quản lý");
            return;
        }
         let updObject = new UserDomainUpdateObject();
         updObject.DOMAINUSER = this.userdomains;
         updObject.IsEditLink = '0';
         updObject.IsEditUser = '1';
         updObject.OPTION = this.currentOptionSearch;
         this.domainUserService.updateUserDomain(updObject).subscribe(res => {
             if(res.Succeeded)
             {
                 this.notificationService.printSuccessMessage(res.Message);
             }
             else
             {
                 this.notificationService.printErrorMessage(res.Message);
             }
                
                this.loadingBarService.complete();
            },
            error => {
                if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    this.utilityService.navigateToSignIn();

                }
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
            });
        //this.optionService.updateOption()
    }
    loadDomainUser() {
        this.loadingBarService.start();

        this.dataService.getOptionUsers(this.domainid)
            .subscribe((res: UserDomain[]) => {
                this.userdomains = res;
                this.loadingBarService.complete();
            },
            error => {
                if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    this.utilityService.navigateToSignIn();

                }
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
            });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
        //this.loadOptionlinks();

    };

    addNewDomainUser(usrdomain: UserDomain) {
        let duplicateObj  = this.userdomains.find(usr => usr.USER_ID ==this.selectedManageUser.UserName);
        //console.log(duplicateObj);
        if(duplicateObj != null)
        {
            this.loadingBarService.start();
            this.loadingBarService.complete();
            this.notificationService.printErrorMessage('User đã tồn tại trong danh sách!' );
            return;
        }
        //console.log(usrdomain);
        let newItem = new UserDomain();
        newItem.DOMAIN_ID = this.currentOptionSearch.DOMAIN_ID;
        newItem.NOTES = this.addUserDomain.NOTES;
        newItem.USER_ID = this.selectedManageUser.UserName;
        newItem.USERID = this.selectedManageUser.Id;
        //console.log(newItem);
        this.itemsService.addItemToStart(this.userdomains,newItem);


    }

    deleteDomainUser(usrdomain:UserDomain)
    {
        this.itemsService.removeItemFromArray<UserDomain>(this.userdomains, usrdomain);

    }



}