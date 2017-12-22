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
import { SourceModel } from "./source";
import { SourceService } from "./source.service";

@Component({
  // moduleId: module.id,

  selector: 'source',
  templateUrl: 'source-list.component.html',

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
export class SourceListComponent implements AfterViewChecked {
  viewSourcerForm: NgForm;
  @ViewChild('viewSourceForm') currentForm: NgForm;
  @ViewChild('childModal') public childModal: ModalDirective;
  sourceModel: SourceModel[];
  selectedSourceModel: SourceModel;
  apiHost: string;

  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public searchString: string;
  public addSourceModel: SourceModel;
  // Modal properties
  @ViewChild('modal')
  modal: any;
  items: string[] = ['item1', 'item2', 'item3'];
  selected: string;
  output: string;
  selectedSourceId: number;
  selectedSourceLoaded: boolean = false;
  index: number = 0;
  backdropOptions = [true, false, 'static'];
  animation: boolean = true;
  keyboard: boolean = true;
  backdrop: string | boolean = true;
  onEdit: boolean = false;
  public addingSourceModel: boolean = false;

  formErrors = {
    'SourceCode': '',
    'SourceName': '',
    // 'SourceLocation': '',
    };
  public isValid: boolean = true;
  validationMessages = {
    'SourceCode': {
      'required': 'Mã source không được để trống',
      'maxlength': 'Mã source phải từ 1-15 ký tự',
    },
    'SourceName': {
      'required': 'Tên source không được để trống',
      'maxlength': 'Tên source phải từ 1-200 ký tự',
    }
    ,
    // 'SourceLocation': {
    //   'required': 'Đường dẫn không được để trống',
    //   'maxlength': 'Đường dẫn phải dài 1-1000 ký tự',
    // }, 
    'Price': {
        'required': 'Trường giá là bắt buộc',
        'maxlength': 'Giá không được nhập quá 18 số',
        'pattern' : 'Giá không hợp lệ '
    },
    'PriceVat': {
        'required': 'Trường giá bao gồm VAT là bắt buộc',
        'maxlength': 'Giá bao gồm VAT không được nhập quá 18 số',
        'pattern' : 'Giá VAT không hợp lệ '
    },
    'Vat': {
        'required': 'Trường VAT là bắt buộc',
        'maxlength': 'VAT không được nhập quá 5 số',
        'pattern': 'VAT không hợp lệ '

    }, 'DiscountAmt': {
      'required': 'Trường giảm giá là bắt buộc',
      'maxlength': 'Giảm giá không được nhập quá 18 số',
      'pattern': 'Thông tin giảm giá không hợp lệ '

    },
  };
  constructor(
    private dataService: SourceService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private loadingBarService: SlimLoadingBarService,

    private membershipService: MembershipService
  ) {
    this.addSourceModel = new SourceModel();
    this.searchString = '';
    this.selectedSourceModel = new SourceModel();
    
  }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.dataService.setToken(this.membershipService.getTokenUser());
    this.loadSources('');
    
    

  }
  search(searchstring: string) {
    if(!searchstring)
      searchstring = '';
    this.currentPage = 1;
    this.loadSources(searchstring);
  }

  loadSources(searchString?: string) {
    this.loadingBarService.start();
    this.dataService.getSources(this.currentPage, this.itemsPerPage, searchString)
      .subscribe((res: PaginatedResult<SourceModel[]>) => {
          this.sourceModel = res.result;// schedules;
          //console.log(this.sourceModel);
          this.totalItems = res.pagination.TotalItems;
          this.loadingBarService.complete();
        },
        error => {
          // this.loadingBarService.complete();
          // this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
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
        });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    if (!this.searchString)
      this.loadSources('');
    else
      this.loadSources(this.searchString);

  };

  ngAfterViewChecked(): void {
    this.formChanged();
  }
  formChanged() {
    if (this.currentForm === this.viewSourcerForm) { return; }
    this.viewSourcerForm = this.currentForm;
    if (this.viewSourcerForm) {
      this.viewSourcerForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (!this.viewSourcerForm) { return; }
    const form = this.viewSourcerForm.form;
    this.isValid = true;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        this.isValid = false;
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  addNewSource(sourceModel: SourceModel) {

    //console.log(domain);
    this.loadingBarService.start();

    this.dataService.createSource(sourceModel)
      .subscribe(rs => {
          if (rs.Succeeded) {
            this.notificationService.printSuccessMessage(rs.Message);
            this.sourceModel.push(sourceModel);
            this.addSourceModel = new SourceModel();
            this.loadSources('');
          }
          else {
            this.notificationService.printErrorMessage(rs.Message);
          }
          //this.notificationService.printSuccessMessage('Thêm domain thành công');
        this.hideChildModal();
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


  viewAddSource() {
    this.onEdit = false;
    this.addSourceModel = new SourceModel();
    this.selectedSourceModel = new SourceModel();
    this.addingSourceModel = true;
    this.loadingBarService.complete();
    this.selectedSourceLoaded = true;
    this.childModal.show();

  }
  deleteSource(sourceModel: SourceModel) {
    //console.log(domain);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
      () => {
        this.loadingBarService.start();
        this.dataService.deleteSource(sourceModel.SourceId)
          .subscribe(rs => {
              if (rs.Succeeded) {
                this.notificationService.printSuccessMessage(rs.Message);
                this.itemsService.removeItemFromArray<SourceModel>(this.sourceModel, sourceModel);
              }
              else {
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
  editSource(sourceModel: SourceModel) {
    //console.log(domain);

    //console.log(this.selectedManageUser);

    this.loadingBarService.start();
    this.onEdit = true;
    this.dataService.updateSource(this.selectedSourceModel)
      .subscribe(res => {
          if (res.Succeeded) {
            this.notificationService.printSuccessMessage(res.Message);
          }
          else {
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




  public viewSourceDetails(sourceModel: SourceModel): void {
    this.addingSourceModel = false;

    this.selectedSourceModel = sourceModel;

    this.set0();
   // console.log(this.selectedSourceModel);

    this.loadingBarService.complete();
    this.selectedSourceLoaded = true;

    this.childModal.show();
  }

  public set0() {
    if (this.selectedSourceModel.Price == null) {
      this.selectedSourceModel.Price = 0;
    }
    if (this.selectedSourceModel.Vat == null) {
      this.selectedSourceModel.Vat = 0;
    }
    if (this.selectedSourceModel.PriceVat == null) {
      this.selectedSourceModel.PriceVat = 0;
    }
    if (this.selectedSourceModel.DiscountAmt == null) {
      this.selectedSourceModel.DiscountAmt = 0;
    }
  }


  public hideChildModal(): void {
    this.childModal.hide();
  }


  changePrice(): void {
    this.selectedSourceModel.PriceVat = this.selectedSourceModel.Price *
      this.selectedSourceModel.Vat /
      100;
    this.addSourceModel.PriceVat = this.addSourceModel.Price *
      this.addSourceModel.Vat /
      100;
  }
}

