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
import { ItemsService } from '../shared/utils/items.service';
import { ConfigService } from '../shared/utils/config.service';
import { Pagination, PaginatedResult } from '../shared/interfaces';
import { NotificationService } from "../shared/utils/notification.service";
import { Message } from "./message";
import { DataService } from "./message.service";
import {Feature} from "./feature"
import {FeatureService} from "./feature.service"
import {UtilityService} from "../shared/services/utility.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DataShareService } from "../shared/services/dataShare.service";
import {Paginated} from "./paginated";
import {Subscription} from "rxjs";
import {MembershipService} from "../login/membership.service";
import { ReCaptchaComponent } from "angular2-recaptcha";
import { NgForm } from "@angular/forms";
import { DomainProfileService } from "./domainprofile.service";
import { LinkNotificationService } from "./linknotification.service";
@Component({
    // moduleId: module.id,

    selector: 'messages',
    templateUrl: 'messages-list.component.html',
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
    styles:[`td
{
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}`]
})
export class MessageListComponent extends Paginated implements AfterViewChecked {
    viewMessageForm : NgForm;
    @ViewChild('viewMessageForm') currentForm: NgForm;
    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
    @ViewChild('childModal') public childModal: ModalDirective;
    messages: Message[];
    selectedMessage: Message;
    apiHost: string;
    public searchString : string;
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    public Ip : string;
    public Domain: string;
    public feature : Feature;
    public isConfirm: boolean;
    public isDisableNotify: boolean;
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedMessageId: number;
    selectedMessageLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    addingUser: boolean = false;
     //private _messageApiUrl: string = 'http://localhost:9823/api/Messages/';
  private _displayingTotal: number;
  private sub: Subscription;
  formErrors = {
    'CONTENTS': ''
 
  };
  public isValid: boolean = true;
  validationMessages = {
    'CONTENTS': {
      'required':      'Nội dung không được để trống', 
      'maxlength':     'Nội dung phải từ 1-500 ký tự',
    }
  };
    constructor(
     //   private dataService: DataService,
     //   private itemsService: ItemsService,
        private configService: ConfigService,
        private notificationService: NotificationService,
        private loadingBarService: SlimLoadingBarService,
        private featureService: FeatureService,
        public utilityService: UtilityService,
        private dataShareService: DataService,
        private membershipService:MembershipService,
        private domainProfileService: DomainProfileService,
        private linkNotificationService: LinkNotificationService,
  private route: ActivatedRoute,
  private router: Router
        )
    {
      super(0, 0, 0);
      this.feature = new Feature();
      this.isConfirm = false;
      this.Ip = "";
      this.Domain = "";
      this.isDisableNotify = false;
      //this._messageApiUrl = configService.getApiURI() + 'Messages/';
    }

    ngOnInit() {
       // this.apiHost = this.configService.getApiHost();
      this.sub = this.route.params.subscribe(params => {
        this.dataShareService.set( 12);
        this.dataShareService.setToken(this.membershipService.getTokenUser());
        this.featureService.setToken(this.membershipService.getTokenUser());
        this.domainProfileService.setToken(this.membershipService.getTokenUser());
        this.linkNotificationService.setToken(this.membershipService.getTokenUser());
        this.loadMessages('');
        
        //this.cleanFeature();
        //this.feature = new Feature();
      });



    }
    
    ngAfterViewChecked(): void {
            this.formChanged();
    }
    formChanged()
    {
         if (this.currentForm === this.viewMessageForm) { return; }
         this.viewMessageForm = this.currentForm;
         if(this.viewMessageForm)
         {
            this.viewMessageForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
         }
    }
    onValueChanged(data?: any)
    {
        if (!this.viewMessageForm) { return; }
        const form = this.viewMessageForm.form;
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
    loadMessages(searchString?:string) {
        var _userData = this.membershipService.getLoggedInUser(); 
       this.dataShareService.getMessagesByUsername(this._page,_userData.Username,searchString)
            .subscribe(res => {

                var data: any = res.json();

                this.messages = data.Items;
                this._displayingTotal = data.TotalCount;
                this._page = data.Page;
                this._pagesCount = data.TotalPages;
                this._totalCount = data.TotalCount;
            //    this._albumTitle = this._photos[0].AlbumTitle;
            },
            error => {
                
                if (error.status == 401 || error.status == 302 || error.status==404) {
                    this.notificationService.printErrorMessage("Bạn không có quyền truy cập vào chức năng này!");
                    this.utilityService.navigateToSignIn();

                }
                 this.notificationService.printErrorMessage("Lỗi - " +error);
              //console.error('Error: ' + error)


            });

    }
      // this.dataService.getMessages(this.currentPage, this.itemsPerPage)
      //   .subscribe((res: PaginatedResult<Message[]>) => {
      //       this.messages = res.result;// schedules;
      //       this.totalItems = res.pagination.TotalItems;
      //       this.loadingBarService.complete();
      //     },
      //     error => {
      //       if (error.status == 401 || error.status == 302) {
      //         this.utilityService.navigateToSignIn();
      //       }
      //
      //       console.error('Error: ' + error);
      //
      //       this.loadingBarService.complete();
      //       this.notificationService.printErrorMessage('Có lỗi khi tải thông báo. ' + error);
      //
      //     });
    //}

    // pageChanged(event: any): void {
    //     this.currentPage = event.page;
    //     this.loadMessages();
    //
    // };

  //Thêm hàm này
  search(i): void {
    super.search(i);
    if( !this.searchString)
        this.loadMessages('');
    else
    this.loadMessages(this.searchString);
  };
    searchitem(searchstring: string)
    {
        if(!searchstring)
            searchstring = '';
        this.loadMessages(searchstring);
    }

    addFeature(feature: Feature) {
        // console.log(feature);
        // this.loadingBarService.start();
        let captcharesponse = this.captcha.getResponse();
        this.loadingBarService.start();
        if(captcharesponse == null || captcharesponse === '')
        {
            this.loadingBarService.complete();
            this.notificationService.printErrorMessage('Vui lòng xác thực Captcha!');
        }
        else
        {
            if(this.isDisableNotify)
            {
                var _userData = this.membershipService.getLoggedInUser(); 
                this.linkNotificationService.updateLinkNotification(_userData.Username,this.selectedMessage.Domain,this.selectedMessage.Type,'1')
                .subscribe( rs =>
                {
                    if(rs.Succeeded)
                    {
                    this.notificationService.printSuccessMessage(rs.Message);
  
                    }
                    else
                    {
                        this.notificationService.printErrorMessage(rs.Message);
                    }
                
                    this.loadingBarService.complete();

                },
                error =>
                {
                    if (error.status == 401 || error.status == 302  || error.status==404) {

                        this.utilityService.navigateToSignIn();

                    }
                    this.loadingBarService.complete();
                    this.notificationService.printErrorMessage('Lỗi- ' + error);
                }

            )
        }
        if(this.isConfirm)
        {
            this.domainProfileService.updateProfile(this.selectedMessage.Domain,this.selectedMessage.Type)
            .subscribe( rs =>
                {
                    if(rs.Succeeded)
                    {
                    this.notificationService.printSuccessMessage(rs.Message);
  
                    }
                    else
                    {
                        this.notificationService.printErrorMessage(rs.Message);
                    }
                
                    this.loadingBarService.complete();

                },
                error =>
                {
                    if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                        //this.utilityService.navigateToSignIn();

                    }
                    this.loadingBarService.complete();
                    this.notificationService.printErrorMessage('Lỗi- ' + error);
                }

            )
        }
        feature.RecordStatus = '1';
        feature.AuthStatus = 'U';
        feature.Resource = this.selectedMessage.Id.toString();
        
            var _userData = this.membershipService.getLoggedInUser(); 
        this.featureService.createFeedback(feature,_userData.Username)
            .subscribe(res => {
                if(res.Succeeded)
                {
                    this.notificationService.printSuccessMessage(res.Message);
                    this.feature =new Feature();
                    
                }
                else
                {
                    this.notificationService.printErrorMessage(res.Message);
                }
                this.captcha.reset();
                this.loadingBarService.complete();
                
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Lỗi- ' + error);
            });

        }
    }





    public viewMessageDetails(msg: Message): void {
        if(msg.Status === '1')
        {
            this.dataShareService.updateMessageRead(msg).subscribe(
                rs =>{

                },
                error=>{

                }
        );
        }
        this.isDisableNotify = false;
        if(msg.Type === 'CIP')
        {
            this.domainProfileService.getIp(msg.Domain).subscribe(
                (data:any) =>
            {
                this.Ip = data._body;
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
            })
            
        }
        if(msg.Type === 'RDOM')
        {
            this.domainProfileService.getNewDomain(msg.Domain).subscribe((data:any) =>
            {
                this.Domain = data._body;
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
            })
        }
        this.addingUser = false;
        this.selectedMessage = new Message();
        this.selectedMessage = msg;

        this.loadingBarService.complete();
        this.selectedMessageLoaded = true;

        this.feature.Resource = msg.Id.toString();
        
        this.childModal.show();
        let captcharesponse;
        if(this.captcha)
        {
             captcharesponse= this.captcha.getResponse();
        }
        if(!(captcharesponse == null || captcharesponse === ''))
            this.captcha.reset();
    }


    public hideChildModal(): void {
        let captcharesponse = this.captcha.getResponse();
        if(!(captcharesponse == null || captcharesponse === ''))
            this.captcha.reset();
        this.childModal.hide();
        
        
    }
}
