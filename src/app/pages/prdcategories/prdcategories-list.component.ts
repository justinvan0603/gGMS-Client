import {
  Component, OnInit, ViewChild, Input, Output,
  trigger,
  state,
  style,
  animate,
  transition, AfterViewChecked
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

// import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ItemsService } from '../shared/utils/items.service';
import { ConfigService } from '../shared/utils/config.service';
import { Pagination, PaginatedResult } from '../shared/interfaces';
import { NotificationService } from "../shared/utils/notification.service";
// import { Domain } from "./domain";

// import { ManageUser } from "./manageuser";
// import { ManageUserService } from "./manageuser.service";
import { NgForm } from "@angular/forms";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";



import { Paginated } from "../messages/paginated";
import { Category } from "./prdcategories";
import { CategoryService } from "./prdcategories.service";

@Component({
  // moduleId: module.id,
  selector: 'category',
  templateUrl: 'prdcategories-list.component.html',

  animations: [
    trigger('flyInOut',
      [
        state('in', style({ opacity: 1, transform: 'translateX(0)' })),
        transition('void => *',
          [
            style({
              opacity: 0,
              transform: 'translateX(-100%)'
            }),
            animate('0.5s ease-in')
          ]),
        transition('* => void',
          [
            animate('0.2s 10 ease-out',
              style({
                opacity: 0,
                transform: 'translateX(100%)'
              }))
          ])
      ])
  ],
  styles: [
    `td
{
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}`
  ]


})
export class CategoriesListComponent extends Paginated implements AfterViewChecked {
  viewCategoryForm: NgForm;
  @ViewChild('viewCategoryForm')
  currentForm: NgForm;
  @ViewChild('childModal')
  public childModal: ModalDirective;
  Categories: Category[];
  selectedCategory: Category;
  categoriesParentList: Category[];
  apiHost: string;
  public isViewDetail: boolean = false;
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public searchString: string;
  public addCategory: Category;
  // Modal properties
  @ViewChild('modal')
  modal: any;
  items: string[] = ['item1', 'item2', 'item3'];
  selected: string;
  output: string;
  selectedCategoryId: number;
  selectedCategoryLoaded: boolean = false;
  index: number = 0;
  backdropOptions = [true, false, 'static'];
  animation: boolean = true;
  keyboard: boolean = true;
  backdrop: string | boolean = true;
  onEdit: boolean = false;
  public addingCategory: boolean = false;

  formErrors = {
    'CategoryCode': '',
    'CategoryName': '',
    'CategoryLevel': ''

  };
  public isValid: boolean = true;
  validationMessages = {
    'CategoryCode': {
      'required': 'Mã lĩnh vực không được để trống',
      'maxlength': 'Mã lĩnh vực phải từ 1-15 ký tự',
    },
    'CategoryName': {
      'required': 'Tên lĩnh vực không được để trống',
      'maxlength': 'Tên lĩnh vực phải từ 1-200 ký tự',
    },
    'CategoryLevel': {
      'required': "Cấp độ lĩnh vực không được để trống",
      'pattern': 'Phải là số không âm'
    }


  };

  constructor(
    private dataService: CategoryService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private loadingBarService: SlimLoadingBarService,
    private membershipService: MembershipService
  ) {
    super(0, 0, 0);
    this.addCategory = new Category();
    this.searchString = '';
  }

  ngOnInit() {
    this.dataService.set(12);
    this.apiHost = this.configService.getApiHost();
    this.dataService.setToken(this.membershipService.getTokenUser());
    this.loadCategories('');


    //console.log(this.dataService._token);

  }

  search(i): void {
    super.search(i);
    if (!this.searchString)
      this.loadCategories('');
    else
      this.loadCategories(this.searchString);
  };

  searchitem(searchstring: string) {
    if (!searchstring)
      searchstring = '';
    this.loadCategories(searchstring);
  }

  loadCategories(searchString?: string) {
    this.loadingBarService.start();

    this.dataService.getCategories(this._page, searchString)
      .subscribe(res => {
          var data: any = res.json();

          this.Categories = data.Items;
          //this._displayingTotal = data.TotalCount;
          this._page = data.Page;
          this._pagesCount = data.TotalPages;
          this._totalCount = data.TotalCount;
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
          // this.loadingBarService.complete();
          // this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
        });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    if (!this.searchString)
      this.loadCategories('');
    else
      this.loadCategories(this.searchString);

  };

  ngAfterViewChecked(): void {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.viewCategoryForm) {
      return;
    }
    this.viewCategoryForm = this.currentForm;
    if (this.viewCategoryForm) {
      this.viewCategoryForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any) {
    if (!this.viewCategoryForm) {
      return;
    }
    const form = this.viewCategoryForm.form;
    this.isValid = true;
    for (const field in this.formErrors) {

      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        // console.log(field);
        this.isValid = false;
        const messages = this.validationMessages[field];
        for (const key in control.errors) {

          this.formErrors[field] += messages[key] + ' ';
          // console.log(this.formErrors[field]);
        }
      }
    }
  }

  addNewCategory(category: Category) {
    var _user = this.membershipService.getLoggedInUser();
    category.MAKER_ID = _user.Username;

    //console.log(domain);
    this.loadingBarService.start();

    this.dataService.createCategory(category)
      .subscribe(rs => {
          if (rs.Succeeded) {
            this.notificationService.printSuccessMessage(rs.Message);
            this.Categories.push(category);
            this.addCategory = new Category();
            this.loadCategories('');
            this.hideChildModal();
          } else {
            this.notificationService.printErrorMessage(rs.Message);
          }
          //this.notificationService.printSuccessMessage('Thêm domain thành công');
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
          // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

          //   // this.utilityService.navigateToSignIn();

          // }
          // this.loadingBarService.complete();
          // this.notificationService.printErrorMessage('Lỗi- ' + error);
        });
  }

  //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
  //this.loadSchedules();


  viewAddCategory() {
    this.isViewDetail = false;
    this.onEdit = false;
    this.addCategory = new Category();
    this.selectedCategory = new Category();
    this.addingCategory = true;
    this.loadingBarService.complete();
    this.selectedCategoryLoaded = true;


    this.dataService.getCategories(this._page, '').subscribe((res) => {
      var data: any = res.json();

      this.categoriesParentList = data.Items;
    });

    this.childModal.show();

  }

  deleteCategory(category: Category) {
    //console.log(domain);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
      () => {
        this.loadingBarService.start();
        this.dataService.deleteCategory(category.CATEGORY_ID)
          .subscribe(rs => {
              if (rs.Succeeded) {
                this.notificationService.printSuccessMessage(rs.Message);
                this.itemsService.removeItemFromArray<Category>(this.Categories, category);
              } else {
                this.notificationService.printErrorMessage(rs.Message);
              }

              //this.notificationService.printSuccessMessage('Xóa domain thành công');
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
              // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

              //   this.utilityService.navigateToSignIn();

              // }
              // this.loadingBarService.complete();
              // this.notificationService.printErrorMessage('Lỗi ' + ' ' + error);
            });
      });
  }

  editCategory(category: Category) {
    //console.log(domain);

    //console.log(this.selectedManageUser);
    var _user = this.membershipService.getLoggedInUser();
    this.selectedCategory.EDITOR_ID = _user.Username;
    this.loadingBarService.start();


    this.onEdit = true;
    this.dataService.updateCategory(this.selectedCategory)
      .subscribe(res => {
          if (res.Succeeded) {
            this.notificationService.printSuccessMessage(res.Message);
            this.hideChildModal();
          } else {
            this.notificationService.printErrorMessage(res.Message);
          }
          //this.notificationService.printSuccessMessage('Domain đã được cập nhật');
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
          // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

          //   //this.utilityService.navigateToSignIn();

          // }
          // this.loadingBarService.complete();
          // this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
        });
  }


  public viewDetail(Category: Category) {
    this.addingCategory = false;

    this.selectedCategory = Category;


    this.loadingBarService.complete();
    this.selectedCategoryLoaded = true;

    this.childModal.show();
    this.isViewDetail = true;
  }

  public viewCategoryDetails(category: Category): void {
    this.isViewDetail = false;
    this.addingCategory = false;

    this.selectedCategory = category;


    this.dataService.getCategories(this._page, '').subscribe((res) => {
      var data: any = res.json();

      this.categoriesParentList = data.Items;

      var index = this.categoriesParentList.findIndex(n => n.CATEGORY_ID === category.CATEGORY_ID);

      this.categoriesParentList.splice(index, 1);

    });


    this.loadingBarService.complete();
    this.selectedCategoryLoaded = true;

    this.childModal.show();
  }


  public hideChildModal(): void {
    this.childModal.hide();
    this.loadCategories('');
  }

  public selectedParentNode(categoryId: string): void {
    this.loadingBarService.start();
    if (categoryId) {
      this.dataService.getCategory(categoryId).subscribe(res => {
        this.selectedCategory.CATEGORY_LEVEL = res.CATEGORY_LEVEL + 1;
        this.loadingBarService.complete();
      });
    } else {
      this.selectedCategory.CATEGORY_LEVEL = 1;
    }

  }
}