import {
    Component, OnInit, ViewChild, Input, Output,
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/core';

import { ModalDirective } from 'ng2-bootstrap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

// import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ItemsService } from '../shared/utils/items.service';
import { ConfigService } from '../shared/utils/config.service';
import { Pagination, PaginatedResult } from '../shared/interfaces';
import { NotificationService } from "../shared/utils/notification.service";
import { UserConfig } from "./messageconfigurations";
import { DataService } from "./messageconfigurations.service";
import {Feature} from "./feature"
import { FeatureService } from "./feature.service"
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";
@Component({
    // moduleId: module.id,

    selector: 'messageconfigurationslist',
    templateUrl: 'messageconfigurations-list.component.html',
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
export class MessageConfigurationsListComponent {
    //@ViewChild('childModal') public childModal: ModalDirective;
    userconfigs: UserConfig[];
    selectedUserConfig: UserConfig;
    apiHost: string;

   // public itemsPerPage: number = 10;
   // public totalItems: number = 0;
    //public currentPage: number = 1;

   // public feature : Feature;
    // Modal properties
    //@ViewChild('modal')
    //modal: any;
    //items: string[] = ['item1', 'item2', 'item3'];
    //selected: string;
    //output: string;
    //selectedMessageId: number;
    //selectedMessageLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    //addingUser: boolean = false;
    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        private membershipService:MembershipService,
        ) {  }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        
        this.dataService.setToken(this.membershipService.getTokenUser());
        //console.log(this.dataService._token);
        var _user = this.membershipService.getLoggedInUser();

        this.loadUserConfigs(_user.Username);
        //this.cleanFeature();
        //this.feature = new Feature();
        
    }
    saveConfig(){
        //console.log(this.userconfigs);
        for(let item of this.userconfigs)
        {
            item.CONF_VALUE = item.CONF_VALUE
        }
        var _userData = this.membershipService.getLoggedInUser(); 
        this.dataService.updateUserConfigs(_userData.Username,this.userconfigs).subscribe(() => {
                this.notificationService.printSuccessMessage('Cập nhật thành công');
                this.loadingBarService.complete();
               
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Lỗi- ' + error);
            });
    }
    loadUserConfigs(username:string) {
        this.loadingBarService.start();

        this.dataService.getUserConfigs(username)
            .subscribe((data:UserConfig[]) => {
                this.userconfigs = data;
                //console.log(this.userconfigs);
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Có lỗi khi tải tham số.- ' + error);
                if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    this.utilityService.navigateToSignIn();

                }
            });
    }

    pageChanged(event: any): void {
        ///this.currentPage = event.page;
        var _user = this.membershipService.getLoggedInUser();
        this.loadUserConfigs(_user.Username);

    };


    // addFeature(feature: UserConfig) {
    //     console.log(feature);
    //     this.loadingBarService.start();
    //     this.featureService.createFeedback(feature)
    //         .subscribe(() => {
    //             this.notificationService.printSuccessMessage('Thêm feedback thành công');
    //             this.loadingBarService.complete();
    //             this.feature =new Feature();
    //         },
    //         error => {
    //             this.loadingBarService.complete();
    //             this.notificationService.printErrorMessage('Lỗi- ' + error);
    //         });

    // }





    // public viewMessageDetails(msg: Message): void {
    //     this.addingUser = false;
    //     this.selectedMessage = new Message();
    //     this.selectedMessage = msg;

    //     this.loadingBarService.complete();
    //     this.selectedMessageLoaded = true;

    //     this.feature.Resource = msg.Id.toString();
    //     this.childModal.show();
    // }


    // public hideChildModal(): void {
    //     this.childModal.hide();
    // }
}