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
import { DataService } from "./user.service";
import {ApplicationGroup} from "./applicationGroup";
import {UserGroupService} from "./user-group.service";
import {UserRoleService} from "./user-role.service";
import { ApplicationRole } from "./applicationRole";
import { NgForm } from "@angular/forms";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";

@Component({
    selector: 'users',
    templateUrl: 'users-role.component.html',
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
export class ApplicationRoleComponent implements AfterViewChecked {
    viewUserForm : NgForm;
    @ViewChild('viewUserForm') currentForm: NgForm;
    @ViewChild('childModal') public childModal: ModalDirective;
    users: ApplicationRole[];
    selectedApplicationGroup: ApplicationRole;
    apiHost: string;
    public searchString : string;
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    public addApplicationGroup:ApplicationRole;
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedApplicationGroupLoaded: boolean = false;
    index: number = 0;
    animation: boolean = true;
    onEdit: boolean = false;
    public adding: boolean = false;
    formErrors = {
    'NAME': ''
    };
    public isValid: boolean = true;
    validationMessages = {
    'NAME': {
      'required':      'Tên quyền không được để trống',
      'maxlength':     'Tên quyền phải từ 1-200 ký tự',
    },

    };
    constructor(
        private dataService: UserRoleService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        private membershipService: MembershipService

        ) {
      this.addApplicationGroup = new ApplicationRole();
      dataService.setToken(this.membershipService.getTokenUser());

    }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.loadRoles();
    }

    loadRoles() {
        this.loadingBarService.start();

        this.dataService.get(this.currentPage, this.itemsPerPage)
            .subscribe((res: PaginatedResult<ApplicationRole[]>) => {
                this.users = res.result;// schedules;
              //  this.totalItems = res.pagination.TotalItems;
                this.loadingBarService.complete();
            },
            error => {
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
                // if (error.status == 401 || error.status == 302 ||error.status==0 ) {

                //     this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Có lỗi khi tải, hãy thử đăng nhập lại ' + error);
            });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
        this.loadRoles();

    };


    addNew(usr: ApplicationGroup) {

        //console.log(user);
        //console.log(this.selectedApplicationGroup);
        this.loadingBarService.start();
        this.dataService.create(this.selectedApplicationGroup)
            .subscribe(res => {
                if(res.Succeeded)
                {
                    this.notificationService.printSuccessMessage(res.Message);
                    this.hideChildModal();
                    this.loadingBarService.complete();
                    this.addApplicationGroup =new ApplicationRole();
                    this.loadRoles();
                }
                else
                {
                    this.notificationService.printErrorMessage(res.Message);
                }

            },
            error => {
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
                // if (error.status == 401 || error.status == 302 ||error.status==0) {

                //     this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Thêm quyền thất bại, hãy thử đăng nhập lại - ' + error);
            });
   //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
            //this.loadSchedules();
    }

    viewAdd() {
        this.onEdit = false;
        this.addApplicationGroup = new ApplicationRole();
        this.selectedApplicationGroup = new ApplicationRole();
        this.adding = true;
        this.loadingBarService.complete();
        this.selectedApplicationGroupLoaded = true;
        this.childModal.show();

    }
    loadRolesWithSearch(searchstring?:string) {
        this.loadingBarService.start();

        this.dataService.getWithSearch(this.currentPage, this.itemsPerPage,searchstring)
            .subscribe((res: PaginatedResult<ApplicationRole[]>) => {
                this.users = res.result;// schedules;
              //  this.totalItems = res.pagination.TotalItems;
                this.loadingBarService.complete();
            },
            error => {
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
                // if (error.status == 401 || error.status == 302 ||error.status==0) {

                //     this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Có lỗi khi tải quyền,hãy thử đăng nhập lại ' + error);
            });
    }
    search(searchstring: string)
    {
        //console.log(searchstring);
        if(!searchstring)
            searchstring = '';
        this.currentPage = 1;
        this.loadRolesWithSearch(searchstring);
        //this.loadDomains(searchstring);
    }

    ngAfterViewChecked(): void {
        this.formChanged();
    }

    formChanged()
    {
         if (this.currentForm === this.viewUserForm) { return; }
         this.viewUserForm = this.currentForm;
         if(this.viewUserForm)
         {
            this.viewUserForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
         }
    }
    onValueChanged(data?: any)
    {
        if (!this.viewUserForm) { return; }
        const form = this.viewUserForm.form;
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

  delete(usr: ApplicationRole) {
    //console.log("u"+usr);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
      () => {
        this.loadingBarService.start();
        this.dataService.delete(usr.Id)
          .subscribe(res => {
              if(res.Succeeded)
              {
                this.itemsService.removeItemFromArray<ApplicationRole>(this.users, usr);
                this.notificationService.printSuccessMessage(res.Message);
              }
              else
              {
                  this.notificationService.printErrorMessage(res.Message);
              }

              this.loadingBarService.complete();
            },
            error => {
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
            //     if (error.status == 401 || error.status == 302 ||error.status==0 ) {

            //         this.utilityService.navigateToSignIn();

            //     }
            //   this.loadingBarService.complete();
            //   this.notificationService.printErrorMessage('Xóa quyền thất bại, bạn không có quyền này, hãy thử đăng nhập lại ' + error);
            });
      });
  }

    edit(usr: ApplicationRole) {
        //console.log(usr);
        this.loadingBarService.start();
        this.onEdit = true;
        this.dataService.update(usr)
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

                this.loadingBarService.complete();
            },
            error => {
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
                // if (error.status == 401 || error.status == 302 ||error.status==0) {

                //     this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Cập nhật quyền thất bại,hãy thử đăng nhập lại ' + error);
            });

    }

    public viewDetails(usr: ApplicationRole): void {
      //console.log(usr);
        this.adding = false;
        this.selectedApplicationGroup = new ApplicationRole();
        this.selectedApplicationGroup = usr;
        //alert(this.addingApplicationGroup);
        this.loadingBarService.complete();
        this.selectedApplicationGroupLoaded = true;

        this.childModal.show();
    }


    public hideChildModal(): void {
        this.childModal.hide();
    }
}
