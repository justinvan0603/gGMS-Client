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
import { User } from "./user";
import { DataService } from "./user.service";
import { NgForm } from "@angular/forms";
import { UtilityService } from "../shared/services/utility.service";

@Component({
    // moduleId: module.id,

    selector: 'users',
    templateUrl: 'users-list.component.html',
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
export class UserListComponent {
    viewUserForm : NgForm;
    @ViewChild('viewUserForm') currentForm: NgForm;
    @ViewChild('childModal') public childModal: ModalDirective;
    users: User[];
    selectedUser: User;
    apiHost: string;

    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;

    public addUser:User;
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedUserId: number;
    selectedUserLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    public addingUser: boolean = false;
formErrors = {
    'EMAIL': '',
    'PHONE' : '',
    'Username':'',
    'FULLNAME' : '',
    'Password' : '',
    'DOMAIN' : '',
    'DOMAINDESC' : ''

  };
  public isValid: boolean = true;
  validationMessages = {
    'EMAIL': {
      'required':      'Email không được để trống',
      'pattern':     'Email không hợp lệ',
    },
    'PHONE': {
      'required':      'Điện thoại không được để trống',
      'maxlength':     'Điện thoại phải từ 1-20 ký tự',
    },
    'Username': {
      'required':      'Tên đăng nhập không được để trống',
      'maxlength':     'Tên đăng nhập phải từ 1-50 ký tự',
    },
    'FULLNAME': {
      'required':      'Họ tên không được để trống',
      'maxlength':     'Họ tên phải từ 1-200 ký tự',
    },
    'Password': {
      'required':      'Mật khẩu không được để trống',
      'maxlength':     'Mật khẩu phải từ 1-50 ký tự',
    },
    'DOMAIN': {
      'required':      'Tên miền không được để trống',
      'maxlength':     'Tên miền phải từ 1-200 ký tự',
    },
    'DOMAINDESC': {
      'required':      'Mô tả không được để trống',
      'maxlength':     'Mô tả phải từ 1-500 ký tự',
    },
  };

    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        ) {this.addUser = new User();  }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.loadUsers();


    }

    loadUsers() {
        this.loadingBarService.start();

        this.dataService.getUsers(this.currentPage, this.itemsPerPage,null,'thieu1234')
            .subscribe((res: PaginatedResult<User[]>) => {
                this.users = res.result;// schedules;
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
        this.loadUsers();

    };

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
    addNewUser(usr: User) {

        //console.log(user);
        //console.log(this.selectedUser);
        this.loadingBarService.start();
        this.dataService.createUser(this.selectedUser)
            .subscribe(() => {
                this.notificationService.printSuccessMessage('Thêm tài khoản thành công');
                this.loadingBarService.complete();
                this.users.push(this.selectedUser);
                this.addUser =new User();
                this.loadUsers();
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

                //     this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Lỗi- ' + error);
            });
   //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
            //this.loadSchedules();
    }

    viewAddUser() {
        this.onEdit = false;
        this.addUser = new User();
        this.selectedUser = new User();
        this.addingUser = true;
        this.loadingBarService.complete();
        this.selectedUserLoaded = true;
        this.childModal.show();

    }
deleteUser(usr:User)
{
    // this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
    //         () => {
    //             this.loadingBarService.start();
    //             this.dataService.deleteUser(usr.Id)
    //                 .subscribe(() => {
    //                     this.itemsService.removeItemFromArray<User>(this.users, usr);
    //                     this.notificationService.printSuccessMessage(usr.Username + ' has been deleted.');
    //                     this.loadingBarService.complete();
    //                 },
    //                 error => {
    //                     this.loadingBarService.complete();
    //                     this.notificationService.printErrorMessage('Lỗi ' + usr.Username + ' ' + error);
    //                 });
    //         });
}
editUser(usr: User) {
        //console.log(usr);
        this.loadingBarService.start();
        this.onEdit = true;
        this.dataService.updateUser(usr)
            .subscribe(() => {
                this.notificationService.printSuccessMessage('User đã được cập nhật');
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
                        {this.notificationService.printErrorMessage('Lỗi. ' + error);}
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
            });

    }

    public viewUserDetails(usr: User): void {
        this.addingUser = false;
        this.selectedUser = new User();
        this.selectedUser = usr;
        //alert(this.addingUser);
        this.loadingBarService.complete();
        this.selectedUserLoaded = true;

        this.childModal.show();
    }


    public hideChildModal(): void {
        this.childModal.hide();
    }
}
