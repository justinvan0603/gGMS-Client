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
import {ApplicationRole} from "./applicationRole";
import { UserRoleService } from "./user-role.service";
import { NgForm } from "@angular/forms";
import { UtilityService } from "../shared/services/utility.service";
import {MembershipService} from "../login/membership.service";

@Component({
    // moduleId: module.id,

    selector: 'users',
    templateUrl: 'users-group.component.html',
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
export class ApplicationGroupComponent implements AfterViewChecked {


    viewUserForm : NgForm;
    @ViewChild('viewUserForm') currentForm: NgForm;
    @ViewChild('childModal') public childModal: ModalDirective;
    users: ApplicationGroup[];
    selectedApplicationGroup: ApplicationGroup;
    apiHost: string;
    public searchString : string;
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;

    public addApplicationGroup:ApplicationGroup;
    applicationRole: ApplicationRole[];
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedApplicationGroupLoaded: boolean = false;
    index: number = 0;
    animation: boolean = true;
    onEdit: boolean = false;
    public addingApplicationGroup: boolean = false;
    formErrors = {
    'NAME': ''

  };
  public isValid: boolean = true;
  validationMessages = {
    'NAME': {
      'required':      'Tên nhóm không được để trống',
      'maxlength':     'Tên nhóm phải từ 1-200 ký tự',
    },

  };
    constructor(
        private dataService: UserGroupService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        private roleService: UserRoleService,
        private membershipService:MembershipService
        )
    {
      dataService.setToken(this.membershipService.getTokenUser());
      roleService.setToken(this.membershipService.getTokenUser());
      this.addApplicationGroup = new ApplicationGroup();

    }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.loadApplicationGroups();

         this.loadRoleByGroup();

    }

    loadApplicationGroups() {
        this.loadingBarService.start();

        this.dataService.getApplicationGroups(this.currentPage, this.itemsPerPage)
            .subscribe((res: PaginatedResult<ApplicationGroup[]>) => {
                this.users = res.result;// schedules;
                //this.totalItems = res.pagination.TotalItems;
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
                // if (error.status == 401 || error.status == 302 ||error.status==0) {

                //     this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Có lỗi khi tải danh sách nhóm, hãy thử đăng nhập lại ' + error);
            });
    }
    loadApplicationGroupsWithSearch(searchString? : string) {
        this.loadingBarService.start();

        this.dataService.getApplicationGroupsSearch(this.currentPage, this.itemsPerPage,searchString)
            .subscribe((res: PaginatedResult<ApplicationGroup[]>) => {
                this.users = res.result;// schedules;
                //this.totalItems = res.pagination.TotalItems;
                this.loadingBarService.complete();
            },
            error => {
                if (error.status == 401 || error.status == 302 ||error.status==0) {

                    this.utilityService.navigateToSignIn();

                }
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Có lỗi khi tải danh sách nhóm, hãy thử đăng nhập lại ' + error);
            });
    }
    search(searchstring: string)
    {
        if(!searchstring)
            searchstring = '';
        this.currentPage = 1;
        this.loadApplicationGroupsWithSearch(searchstring);
        //this.loadDomains(searchstring);
    }
  loadRoleByGroup() {
    this.loadingBarService.start();

    this.roleService.get(this.currentPage, this.itemsPerPage)
      .subscribe((res: PaginatedResult<ApplicationRole[]>) => {
          this.applicationRole = res.result;// schedules;

          // this.totalItems = res.pagination.TotalItems;
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
        //   this.loadingBarService.complete();
        //   this.notificationService.printErrorMessage('Có lỗi khi tải danh sách quyền, hãy thử đăng nhập lại ' + error);
        });
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



    pageChanged(event: any): void {
        this.currentPage = event.page;
        this.loadApplicationGroups();

    };


    addNewApplicationGroup(usr: ApplicationGroup) {
      this.loadingBarService.start();
        this.selectedApplicationGroup.Roles = this.applicationRole;
        //console.log(this.selectedApplicationGroup);

        this.dataService.createApplicationGroup(this.selectedApplicationGroup)
            .subscribe(() => {
                this.notificationService.printSuccessMessage('Thêm nhóm người dùng thành công');
                this.loadingBarService.complete();
                this.hideChildModal();
                this.addApplicationGroup =new ApplicationGroup();
                this.loadApplicationGroups();
                

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
                // if (error.status == 401 || error.status == 302 ||error.status==0) {

                //     this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Thêm nhóm người dùng thất bại, hãy thử đăng nhập lại- ' + error);
            });
   //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
            //this.loadSchedules();
    }

    viewAddApplicationGroup() {
        this.onEdit = false;

        this.addApplicationGroup = new ApplicationGroup();
        this.selectedApplicationGroup = new ApplicationGroup();

         this.selectedApplicationGroup.Roles = this.applicationRole;
         //console.log(this.selectedApplicationGroup.Roles);
        // this.loadRoleByGroup();
        this.addingApplicationGroup = true;
        this.loadingBarService.complete();
        this.selectedApplicationGroupLoaded = true;
        this.childModal.show();

    }
deleteApplicationGroup(usr:ApplicationGroup)
{
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
            () => {
                this.loadingBarService.start();
                this.dataService.deleteApplicationGroup(usr.ID)
                    .subscribe(() => {
                        this.itemsService.removeItemFromArray<ApplicationGroup>(this.users, usr);
                        this.notificationService.printSuccessMessage("Nhóm người dùng: " +usr.Name + ' đã được xóa');
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
                //         if (error.status == 401 || error.status == 302 ||error.status==0) {

                //     this.utilityService.navigateToSignIn();

                // }
                //         this.loadingBarService.complete();
                //         this.notificationService.printErrorMessage('Có lỗi khi xóa: ' + usr.Name + ' Hãy thử đăng nhập lại ' + error);
                    });
            });
}
editApplicationGroup(usr: ApplicationGroup) {
      //  console.log(usr);

        usr.Roles = this.selectedApplicationGroup.Roles;
        this.loadingBarService.start();
        this.onEdit = true;
        this.dataService.updateApplicationGroup(usr)
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
                // if (error.status == 401 || error.status == 302 ||error.status==0) {

                //     this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Cập nhật nhóm người dùng thất bại, hãy thử đăng nhập lại ' + error);
            });

    }

    public viewApplicationGroupDetails(usr: ApplicationGroup): void {

      this.dataService.getRoleByGroupDetail(this.currentPage, this.itemsPerPage, usr.ID)
        .subscribe((res: PaginatedResult<ApplicationRole[]>) => {
            // this.applicationRole = res.result;// schedules;

            // this.totalItems = res.pagination.TotalItems;
            this.loadingBarService.complete();
            this.addingApplicationGroup = false;
            this.selectedApplicationGroup = new ApplicationGroup();
            this.selectedApplicationGroup = usr;
            this.selectedApplicationGroup.Roles = res.result;
            //alert(this.addingApplicationGroup);
            this.loadingBarService.complete();
            this.selectedApplicationGroupLoaded = true;
            this.childModal.show();
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
            //   if (error.status == 401 || error.status == 302 ||error.status==0) {

            //         this.utilityService.navigateToSignIn();

            //     }
            // this.loadingBarService.complete();
            // this.notificationService.printErrorMessage('Có lỗi khi tải danh sách nhóm người dùng. ' + error);
          });


    }

  // loadRolesByGroupDetail(id: number) {
  //   this.loadingBarService.start();
  //
  //   this.dataService.getRoleByGroupDetail(this.currentPage, this.itemsPerPage, id)
  //     .subscribe((res: PaginatedResult<ApplicationRole[]>) => {
  //         this.applicationRole = res.result;// schedules;
  //
  //         // this.totalItems = res.pagination.TotalItems;
  //         this.loadingBarService.complete();
  //       },
  //       error => {
  //         this.loadingBarService.complete();
  //         this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
  //       });
  // }

    public hideChildModal(): void {
        this.childModal.hide();
    }
}
