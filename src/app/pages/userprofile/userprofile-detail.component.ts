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



import { ReCaptchaComponent } from "angular2-recaptcha";
import { DataService } from "./userprofile.service";
import { User } from "../users/user";
import { UtilityService } from "../shared/services/utility.service";
import { ApplicationUser } from "./applicationuser";
@Component({
    // moduleId: module.id,

    selector: 'userprofile-detail',
    templateUrl: 'userprofile-detail.component.html',
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
export class UserProfileDetailComponent {
    //@ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
    public currentUser : ApplicationUser;
    apiHost: string;
    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        ) { 
            this.currentUser = new ApplicationUser();
         }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        var _userData = JSON.parse(localStorage.getItem('user'));
         let username : string ;
        username = _userData.Username;

         this.dataService.getUser('',username.toString()).subscribe((data: ApplicationUser) => {
               
                this.loadingBarService.complete();
                this.currentUser = data;
            },
            error => {
                if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                    this.utilityService.navigateToSignIn();

                }
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Lỗi- ' + error);
            });
        //this.cleanFeature();
        //this.feature = new Feature();
        
    }



   


}