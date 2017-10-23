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
import {UserGroupService} from "./user-group.service";
import { NgForm } from "@angular/forms";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";
import {ApplicationRole} from "../users/applicationRole";
import {MenuService} from "./menu-role.service";
import {ApplicationGroup} from "../users/applicationGroup";
import {MenuRole} from "./menuRole";
import {UserRoleService} from "../users/user-role.service";

@Component({
  // moduleId: module.id,

  selector: 'menu',
  templateUrl: 'menu.html',
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
export class Menu implements AfterViewChecked {
  viewUserForm : NgForm;
  @ViewChild('viewUserForm') currentForm: NgForm;
  @ViewChild('childModal') public childModal: ModalDirective;
  menus: MenuRole[];
  roles: ApplicationRole[];
  selectedApplicationGroup: MenuRole;
  selectedMenuParrent: MenuRole;
  selectedRole: ApplicationRole;

  apiHost: string;
  public searchString : string;
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public currentPage: number = 1;

  public addApplicationGroup:MenuRole;

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
    private dataService: MenuService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private loadingBarService: SlimLoadingBarService,
    private membershipService: MembershipService,
    private roleService: UserRoleService

  ) {
    this.addApplicationGroup = new MenuRole();
    dataService.setToken(this.membershipService.getTokenUser());
    roleService.setToken(this.membershipService.getTokenUser())

  }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.loadMenuRoles();
    this.loadRoles();


  }

  loadRoles() {
    this.loadingBarService.start();

    this.roleService.get(this.currentPage, this.itemsPerPage)
      .subscribe((res: PaginatedResult<ApplicationRole[]>) => {
          this.roles = res.result;// schedules;
          this.roles.concat()
          //  this.totalItems = res.pagination.TotalItems;
          this.loadingBarService.complete();
        },
        error => {
          if (error.status == 401 || error.status == 302 ||error.status==0 ) {

            this.utilityService.navigateToSignIn();

          }
          this.loadingBarService.complete();
          this.notificationService.printErrorMessage('Có lỗi khi tải danh sách quyền, hãy thử đăng nhập lại ' + error);
        });
  }

  loadMenuRoles() {
    this.loadingBarService.start();

    this.dataService.get(this.currentPage, this.itemsPerPage)
      .subscribe((res: PaginatedResult<MenuRole[]>) => {
          this.menus = res.result;// schedules;
          //  this.totalItems = res.pagination.TotalItems;
          this.loadingBarService.complete();
        },
        error => {
          if (error.status == 401 || error.status == 302 ||error.status==0) {

            this.utilityService.navigateToSignIn();

          }
          this.loadingBarService.complete();
          this.notificationService.printErrorMessage('Có lỗi khi tải danh sách menu, hãy thử đăng nhập lại ' + error);
        });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.loadMenuRoles();

  };


  addNew(menuRole: MenuRole) {
    //console.log(menuRole);
    this.loadingBarService.start();
    if(this.selectedRole != null)
      {
        menuRole.RoleName = this.selectedRole.Name;
      }
    if(this.selectedMenuParrent)
    {
    menuRole.MenuParent = this.selectedMenuParrent.MenuId;
    }
      
    this.dataService.create(this.selectedApplicationGroup)
      .subscribe(res => {
          if(res.Succeeded)
          {
            this.notificationService.printSuccessMessage(res.Message);
            this.loadingBarService.complete();
            this.addApplicationGroup =new MenuRole();
            this.loadMenuRoles();
          }
          else
          {
            this.notificationService.printErrorMessage(res.Message);
          }

        },
        error => {
          if (error.status == 401 || error.status == 302 ||error.status==0) {

            this.utilityService.navigateToSignIn();

          }
          this.loadingBarService.complete();
          this.notificationService.printErrorMessage('Thêm menu thất bại, hãy thử đăng nhập lại ' + error);
        });
    //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
    //this.loadSchedules();
  }

  viewAdd() {
    this.onEdit = false;
    this.addApplicationGroup = new MenuRole();
    this.selectedApplicationGroup = new MenuRole();
    this.adding = true;
    this.loadingBarService.complete();
    this.selectedApplicationGroupLoaded = true;
    this.childModal.show();

  }
  loadMenuRolesWithSearch(searchstring?:string) {
    this.loadingBarService.start();

    this.dataService.getWithSearch(this.currentPage, this.itemsPerPage,searchstring)
      .subscribe((res: PaginatedResult<MenuRole[]>) => {
          this.menus = res.result;// schedules;
          //  this.totalItems = res.pagination.TotalItems;
          this.loadingBarService.complete();
        },
        error => {
          if (error.status == 401 || error.status == 302 ||error.status==0) {

            this.utilityService.navigateToSignIn();

          }
          this.loadingBarService.complete();
          this.notificationService.printErrorMessage('Tìm menu thất bại, hãy thử đăng nhập lại ' + error);
        });
  }
  search(searchstring: string)
  {
    //console.log(searchstring);
    if(!searchstring)
      searchstring = '';
    this.loadMenuRolesWithSearch(searchstring);
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

  delete(usr: MenuRole) {
    //console.log("u"+usr);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
      () => {
        this.loadingBarService.start();
        this.dataService.delete(usr.MenuId)
          .subscribe(res => {
              if(res.Succeeded)
              {
                this.itemsService.removeItemFromArray<MenuRole>(this.menus, usr);
                this.notificationService.printSuccessMessage(res.Message);
              }
              else
              {
                this.notificationService.printErrorMessage(res.Message);
              }

              this.loadingBarService.complete();
            },
            error => {
              if (error.status == 401 || error.status == 302 ||error.status==0 ) {

                this.utilityService.navigateToSignIn();

              }
              this.loadingBarService.complete();
              this.notificationService.printErrorMessage('Xóa menu thất bại, hãy thử đăng nhập lại' + usr.MenuName + ' ' + error);
            });
      });
  }

  edit(usr: MenuRole) {
    //console.log(usr);
    if(this.selectedRole!=undefined)
      usr.RoleName = this.selectedRole.Name;
    if(this.selectedMenuParrent!=undefined)
      usr.MenuParent = this.selectedMenuParrent.MenuId;
    this.loadingBarService.start();
    this.onEdit = true;
    this.dataService.update(usr)
      .subscribe(res => {
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
          if (error.status == 401 || error.status == 302 ||error.status==0 ) {

            this.utilityService.navigateToSignIn();

          }
          this.loadingBarService.complete();
          this.notificationService.printErrorMessage('Cập nhật menu thất bại, hãy thử đăng nhập lại' + error);
        });

  }

  public viewDetails(usr: MenuRole): void {
    //console.log(usr);
    this.adding = false;
    this.selectedApplicationGroup = new MenuRole();
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
