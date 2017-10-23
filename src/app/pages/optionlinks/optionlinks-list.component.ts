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

import { Optionlink } from "./optionlink";
import { OptionLinkService } from "./optionlinks.service";
import { ItemsService } from "../shared/utils/items.service";
import { NotificationService } from "../shared/utils/notification.service";
import { ConfigService } from "../shared/utils/config.service";
import { PaginatedResult } from "../shared/interfaces";
// import { Option } from "./option";
import { OptionService } from "./option.service";
import { OptionSearchObject } from "./optionsearch";
import { OptionLinkUpdateObject } from "./optionupdateobject";
import { NgForm } from "@angular/forms";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";
import { DomainListComponent } from "../domains/domain-list.component";




// import { ManageUser } from "./manageuser";
// import { ManageUserService } from "./manageuser.service";

@Component({
    // moduleId: module.id,

    selector: 'optionlinks',
    templateUrl: 'optionlinks-list.component.html',
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
export class OptionLinkListComponent implements AfterViewChecked {
        
    public isTOUTAll: boolean;
    public isCIPAll: boolean;
    public isRDOMAll : boolean;
    public isECODE: boolean;
    public isCCON: boolean;
    //@ViewChild('childModal') public childModal: ModalDirective;
    addOptionForm : NgForm;
    @ViewChild('addOptionForm') currentForm: NgForm;
    optionlinks: Array<Optionlink>;
    selectedOptions: Optionlink;
    domainid : string;
    apiHost: string;
    currentOptionSearch : OptionSearchObject;

    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    
    public addOptionLink:Optionlink;
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
    public addingDomain: boolean = false;
    formErrors = {
    'Link': ''
 
  };
  public isValid: boolean = true;
  validationMessages = {
    'Link': {
      'required':      'Link không được để trống', 
      'maxlength':     'Link phải từ 1-500 ký tự',
    }
  };
    constructor(
        private dataService: OptionLinkService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        private loadingBarService: SlimLoadingBarService,
        private route: ActivatedRoute,
        public utilityService: UtilityService,
        private optionService: OptionService,
        private membershipService:MembershipService

        ) {this.addOptionLink = new Optionlink(); 
            this.isTOUTAll = false;
            this.isCCON = false;
            this.isCIPAll = false;
            this.isECODE = false;
            this.isRDOMAll = false;
         }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.route.params.subscribe(params => {this.domainid=params['domainid']});
        this.optionService.setToken(this.membershipService.getTokenUser());
        this.dataService.setToken(this.membershipService.getTokenUser());
        this.loadOptionlinks();
        this.loadOption();
        
        
    }
    checkToutAllEvent($event)
    {
         this.isTOUTAll = $event.target.checked;
         if(this.isTOUTAll)
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_TOUT = '0';
            }
        }
        else
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_TOUT = '1';
            }
        }
    }
    checkCipAllEvent($event)
    {
         this.isCIPAll = $event.target.checked;
         if(this.isCIPAll)
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_CIP = '0';
            }
        }
        else
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_CIP = '1';
            }
        }
    }
    checkRdomAllEvent($event)
    {
         this.isRDOMAll = $event.target.checked;
         if(this.isRDOMAll)
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_RDOM = '0';
            }
        }
        else
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_RDOM = '1';
            }
        }
    }
    checkEcodeAllEvent($event)
    {
         this.isECODE = $event.target.checked;
         if(this.isECODE)
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_ECODE = '0';
            }
        }
        else
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_ECODE = '1';
            }
        }
    }
    checkCconAllEvent($event)
    {
         this.isCCON = $event.target.checked;
         if(this.isCCON)
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_CCON = '0';
            }
        }
        else
        {
            for(let i =0; i< this.optionlinks.length; i++)
            {
                this.optionlinks[i].UserDomainNotify.IS_CCON = '1';
            }
        }
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
    loadOption()
    {
        this.optionService.getOption(this.domainid).subscribe((data: OptionSearchObject)=>{
            this.currentOptionSearch = data;
        },
        error => {
                 this.loadingBarService.complete();
               this.notificationService.printErrorMessage('Có lỗi khi tải .- ' + error);
               if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    this.utilityService.navigateToSignIn();

                }
                }
        );
    }
    saveOption()
    {
         if(this.optionlinks.length  == 0)
         {
             this.notificationService.printErrorMessage("Lỗi: Phải có ít nhất 1 link trong danh sách!");
             return;
         }
         let updObject = new OptionLinkUpdateObject();
         updObject.DOMAINLINK = this.optionlinks;
         updObject.IsEditLink = '1';
         updObject.OPTION = this.currentOptionSearch;
         this.optionService.updateOption(updObject).subscribe(res => {
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
    loadOptionlinks() {
        this.loadingBarService.start();
        var _user = this.membershipService.getLoggedInUser();
        this.dataService.getOptionLinks(_user.Username,this.domainid)
            .subscribe((res: Optionlink[]) => {
                this.optionlinks = res;
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

    addNewOption(optlink: Optionlink) {
        if(optlink.Link.includes(this.currentOptionSearch.DOMAIN_ID))
        {
            let opt = this.optionlinks.find(link => link.Link == optlink.Link);
            //console.log(opt);
            if(opt != null)
            {
                this.loadingBarService.start();
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Link đã tồn tại trong danh sách!' );
                return;
            }
            if(!(optlink.Link.includes(DomainListComponent.DOMAIN_PREFIX) || optlink.Link.includes(DomainListComponent.DOMAIN_PREFIX_HTTPS)))
            {
                this.notificationService.printErrorMessage("Lỗi - Tên miền phải chứa tiền tố 'http://' hoặc 'https://' ");
                return;
            }
            var _userData = this.membershipService.getLoggedInUser(); 
            let newItem = new Optionlink();
            newItem.Link = optlink.Link;
            newItem.RecordStatus = '1';
            newItem.CreateDt = new Date();
            newItem.MakerId = _userData.Username;
            newItem.OptionsId = this.currentOptionSearch.ID;
            newItem.DomainId = this.domainid;
            newItem.Id = 0;
            newItem.UserDomainNotify.USERNAME = _userData.Username;
            newItem.UserDomainNotify.DOMAIN_ID = optlink.Link;
        //newItem.CreateDt = new Date();
        
        this.itemsService.addItemToStart(this.optionlinks,newItem);
    }
    else{
            this.loadingBarService.start();
            this.loadingBarService.complete();
            this.notificationService.printErrorMessage('Link phải thuộc tên miền gốc: '.concat(this.currentOptionSearch.DOMAIN_ID) );
    }


    }

deletOptionLink(link:Optionlink)
{
    this.itemsService.removeItemFromArray<Optionlink>(this.optionlinks, link);

}



}