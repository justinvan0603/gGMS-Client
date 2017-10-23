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
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";
import { UserDomainService } from "./userdomain.service";
import { DomainUserUpdateObject } from "./domainuserupdateobject";


@Component({
    // moduleId: module.id,

    selector: 'optionusers',
    templateUrl: 'domainuser-list.component.html',
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
export class DomainUserListComponent  {
    //@ViewChild('childModal') public childModal: ModalDirective;
    //searchString: string;
    isCheckAll:boolean;
    editeduser : string;
    ListDomainUser: DomainUserUpdateObject[];
    ListDomainUserBeforeSearch:DomainUserUpdateObject[];
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;

    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;


    constructor(
        private dataService: UserDomainService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        private route: ActivatedRoute,

        private membershipService:MembershipService

        ) {}

    ngOnInit() {

        this.route.params.subscribe(params => {this.editeduser=params['editeduser']});
        this.dataService.setToken(this.membershipService.getTokenUser());
        this.loadDomainUser();
        this.isCheckAll = false;

        
    }
    // search(searchString:string)
    // {
    //     if(searchString != '')
    //     {
    //         this.ListDomainUser = this.ListDomainUserBeforeSearch.filter(item => {
    //             for(let key in item)
    //             {
    //                 if((""+item[key]).includes(searchString))
    //                 {
    //                     return true;
    //                 }
    //             }
    //             return false;
    //         });
    //     }
    // }
    loadDomainUser()
    {
        var _user = this.membershipService.getLoggedInUser();
        this.dataService.getDomains(this.editeduser,_user.Username).subscribe((data: DomainUserUpdateObject[])=>{
            this.ListDomainUser = data;
            this.ListDomainUserBeforeSearch = data;
            //console.log(this.ListDomainUser.length);
            this.loadingBarService.complete();
        },
        error => {
                 this.loadingBarService.complete();
               this.notificationService.printErrorMessage('Có lỗi khi tải .- ' + error);
                }
        );
    }
    checkAllEvent($event)
    {
        
        this.isCheckAll = $event.target.checked;
        if(this.isCheckAll)
        {
            for(let i =0; i< this.ListDomainUser.length; i++)
            {
                this.ListDomainUser[i].IsChecked = true;
            }
        }
        else
        {
            for(let i =0; i< this.ListDomainUser.length; i++)
            {
                this.ListDomainUser[i].IsChecked = false;
            }
        }
    }

    insertDomainUser()
    {
        this.dataService.insertUserDomain(this.ListDomainUser,this.editeduser).subscribe(rs=>{
                if(rs.Succeeded)
                {
                    this.notificationService.printSuccessMessage(rs.Message);
                }
                else
                {
                    this.notificationService.printErrorMessage("Có lỗi xảy ra vui lòng thử lại sau!");
                }
        },
        error => {
                 if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    //this.utilityService.navigateToSignIn();

                }
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Lỗi- ' + error);
                }
        );
    }





}