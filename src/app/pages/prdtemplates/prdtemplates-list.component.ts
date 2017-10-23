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


import { PrdTemplate } from "./prdtemplates";
import { TemplateService } from "./prdtemplates.service";
import { Paginated } from "../messages/paginated";

@Component({
  // moduleId: module.id,

  selector: 'prdtemplates',
  templateUrl: 'prdtemplates-list.component.html',

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
  styles: [`td
{
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}`]


})
export class TemplateListComponent extends Paginated implements AfterViewChecked {
  listUploadImages: any;
  viewTemplateForm: NgForm;
  @ViewChild('chooseFileInput') chooseFileInput: any;
  @ViewChild('listSelectedFileInput') listSelectedFileInput: any;
  @ViewChild('viewTemplateForm') currentForm: NgForm;
  @ViewChild('childModal') public childModal: ModalDirective;

  @ViewChild('imageModal') public imageModal: ModalDirective;

  Templates: PrdTemplate[];
  selectedTemplate: PrdTemplate;
  apiHost: string;
  public isViewDetail: boolean = false;
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public searchString: string;
  public addTemplate: PrdTemplate;
  // @Input('chooseFile') chooseFileInput: Input;
  // Modal properties
  @ViewChild('modal')
  modal: any;

  items: string[] = ['item1', 'item2', 'item3'];
  selected: string;
  output: string;
  selectedTemplateId: number;
  selectedTemplateLoaded: boolean = false;
  index: number = 0;
  backdropOptions = [true, false, 'static'];
  animation: boolean = true;
  keyboard: boolean = true;
  backdrop: string | boolean = true;
  onEdit: boolean = false;
  public addingTemplate: boolean = false;


  listImages: string[];

  formErrors = {
    // 'TemplateCode': '',
    'TemplateName': '',
    'TemplateLocation': '',
    'Notes': '',
    'Price': '',
    'Vat': '',
    'DiscountAmt': '',
    'DEMOLINK': '',

  };
  public isValid: boolean = true;
  validationMessages = {
    // 'TemplateCode': {
    //   'required': 'Mã Template không được để trống',
    //   'maxlength': 'Mã Template phải từ 1-15 ký tự',
    // },
    'TemplateName': {
      'required': 'Tên Template không được để trống',
      'maxlength': 'Tên Template phải từ 1-256 ký tự',
    },
    'TemplateLocation': {
      'required': 'Vị trí lưu không được để trống',
      'maxlength': 'Vị trí lưu phải từ 1-1000 ký tự',
    }
    ,
    'Notes': {
      'maxlength': 'Vị trí lưu phải từ 1-500 ký tự',

    }
    ,
    'Price': {
      'required': 'Giá gốc không được để trống',
      'pattern': 'Giá gốc không hợp lệ (tối đa 9 chữ số)',
    }
    ,
    'Vat': {
      'required': 'Vat không được để trống',
      'pattern': 'Vat không hợp lệ',

    }
    ,
    'DiscountAmt': {
      'required': 'Số tiền giảm giá không được để trống',
      'pattern': 'Số tiền giảm giá không hợp lệ (tối đa 9 chữ số)s',
    },
    'DEMOLINK': {

      'maxlength': 'Link demo phải từ 1-1000 ký tự',
    }
  };
  constructor(
    private dataService: TemplateService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private loadingBarService: SlimLoadingBarService,

    private membershipService: MembershipService
  ) {
    super(0, 0, 0);
    this.addTemplate = new PrdTemplate();
    this.searchString = '';
  }

  ngOnInit() {
    this.dataService.set(12);
    this.apiHost = this.configService.getApiHost();
    this.dataService.setToken(this.membershipService.getTokenUser());
    this.loadTemplates('');

    this.listImages = new Array<string>();
    //console.log(this.dataService._token);

  }

  priceChange() {
    if (this.selectedTemplate.Price != null) {
      this.selectedTemplate.PriceVat = (this.selectedTemplate.Price * this.selectedTemplate.Vat) / 100;
    }
  }
  vatChange() {
    if (this.selectedTemplate.Vat != null) {
      this.selectedTemplate.PriceVat = (this.selectedTemplate.Price * this.selectedTemplate.Vat) / 100;
    }
  }



  search(i): void {
    super.search(i);
    if (!this.searchString)
      this.loadTemplates('');
    else
      {
        this._page =0;
        this._pagesCount = 12;
      this.loadTemplates(this.searchString);
      }
  };
  searchitem(searchstring: string) {
    
    if (!searchstring)
      searchstring = '';
    super.search(0);
    this.loadTemplates(searchstring);
  }

  loadTemplates(searchString?: string) {
    this.loadingBarService.start();

    this.dataService.getTemplates(this._page, searchString)
      .subscribe(res => {
        var data: any = res.json();

        this.Templates = data.Items;
        //this._displayingTotal = data.TotalCount;
        this._page = data.Page;
        this._pagesCount = data.TotalPages;
        this._totalCount = data.TotalCount;
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
        // this.loadingBarService.complete();
        // this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
      });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    if (!this.searchString)
      this.loadTemplates('');
    else
      this.loadTemplates(this.searchString);

  };

  ngAfterViewChecked(): void {
    this.formChanged();
  }
  formChanged() {
    if (this.currentForm === this.viewTemplateForm) { return; }
    this.viewTemplateForm = this.currentForm;
    if (this.viewTemplateForm) {
      this.viewTemplateForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (!this.viewTemplateForm) { return; }
    const form = this.viewTemplateForm.form;
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


  addNewTemplate(Template: PrdTemplate) {
    var _user = this.membershipService.getLoggedInUser();
    Template.MakerId = _user.Username;

    this.loadingBarService.start();

    ///  Create new teamplate push on server 
    this.dataService.createTemplate(Template)
      .subscribe(rs => {
        // Push success
        if (rs.Succeeded) {

          Template = rs.Data;
          if(this.listUploadImages != null)
            {
              if(this.listImages.length >0)
                {
          // Push images on server 
          this.dataService.uploadImageFile(Template.TemplateId, [], this.listUploadImages).subscribe(
            rs => {

              if (!rs.Succeeded) {
                this.notificationService.printErrorMessage(rs.Message);
              }
              // Push success
              else {
                Template.IMAGES_PATH = rs.Data;

                this.notificationService.printSuccessMessage(rs.Message);

                // Update column Image for template 
                this.dataService.updateTemplate(Template).subscribe(rs => {
                  if (rs.Succeeded) {
                    this.notificationService.printSuccessMessage(rs.Message);
                  } else {
                    this.notificationService.printErrorMessage(rs.Message);
                  }

                });
              }
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
              // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

              // }
              // this.notificationService.printErrorMessage('Lỗi- ' + error);
            }
          );
                }
            }

          this.notificationService.printSuccessMessage(rs.Message);
          this.Templates.push(Template);
          this.addTemplate = new PrdTemplate();
          this.loadTemplates('');
          this.hideChildModal();
          this.chooseFileInput.nativeElement.value = "";
        }
        else {
          this.notificationService.printErrorMessage(rs.Message);
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
        // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {



        // }
        // this.loadingBarService.complete();
        // this.notificationService.printErrorMessage('Lỗi- ' + error);
      });



  }

  //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
  //this.loadSchedules();


  viewAddTemplate() {
    this.isViewDetail = false;
    this.onEdit = false;
    this.addTemplate = new PrdTemplate();
    this.selectedTemplate = new PrdTemplate();
    this.addingTemplate = true;
    this.loadingBarService.complete();
    this.selectedTemplateLoaded = true;
    this.dataService.getTemplateCode().subscribe(
      (rs:any) => {
      //  console.log(rs);
        this.selectedTemplate.TemplateCode = rs._body;
      },
      error=>{
        this.loadingBarService.complete();
        this.notificationService.printErrorMessage('Lỗi- ' + error);
      }

    );
    this.childModal.show();

  }
  deleteTemplate(Template: PrdTemplate) {
    //console.log(domain);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
      () => {
        this.loadingBarService.start();
        this.dataService.deleteTemplate(Template.TemplateId)
          .subscribe(rs => {
            if (rs.Succeeded) {
              this.notificationService.printSuccessMessage(rs.Message);
              this.itemsService.removeItemFromArray<PrdTemplate>(this.Templates, Template);
            }
            else {
              this.notificationService.printErrorMessage(rs.Message);
            }

            //this.notificationService.printSuccessMessage('Xóa domain thành công');
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
            // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

            //   this.utilityService.navigateToSignIn();

            // }
            // this.loadingBarService.complete();
            // this.notificationService.printErrorMessage('Lỗi ' + ' ' + error);
          });
      });
  }


  editTemplate(Template: PrdTemplate) {
    //console.log(domain);

    //console.log(this.selectedManageUser);
    var _user = this.membershipService.getLoggedInUser();
    Template.EditorId = _user.Username;
    this.loadingBarService.start();
    this.onEdit = true;
    if (Template.IMAGES_PATH == null) {
      Template.IMAGES_PATH = '';
    }
    this.dataService.updateImageFile(Template.IMAGES_PATH, Template.TemplateId, [], this.listUploadImages).subscribe(
      rs => {

          if (rs.Succeeded)
          {
            this.notificationService.printSuccessMessage(rs.Message);
            Template.IMAGES_PATH = rs.Data;

          }
          else
          {
            this.notificationService.printErrorMessage(rs.Message);
          }

          this.dataService.updateTemplate(Template)
            .subscribe(res => {
              if (res.Succeeded) {

                this.selectedTemplate = res.Data;

                console.log(Template);

                //this.chooseFileInput.nativeElement.value = "";
                this.notificationService.printSuccessMessage(res.Message);
                this.hideChildModal();
              }
              else {
                this.notificationService.printErrorMessage(res.Message);
              }
              //this.notificationService.printSuccessMessage('Domain đã được cập nhật');
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
              // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

              //   //this.utilityService.navigateToSignIn();

              // }
              // this.loadingBarService.complete();
              // this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
            });

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
        // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

        // }
        // this.loadingBarService.complete();
        // this.notificationService.printErrorMessage('Lỗi- ' + error);
      }
    );


  }




  public viewTemplateDetails(Template: PrdTemplate): void {
    this.isViewDetail = false;
    this.addingTemplate = false;

    this.selectedTemplate = Template;


    this.loadingBarService.complete();
    this.selectedTemplateLoaded = true;

    this.childModal.show();
  }


  public hideChildModal(): void {
    this.chooseFileInput.nativeElement.value = "";
    this.listUploadImages = null;
    this.listSelectedFileInput.nativeElement.value = "";
    this.childModal.hide();

  }
  public hideImageModal(): void {

    this.imageModal.hide();

  }
  public viewImageModal(selectedTemplate: PrdTemplate): void {

    this.listImages = [];

    if (selectedTemplate.IMAGES_PATH === null ||
      selectedTemplate.IMAGES_PATH == null ||
      selectedTemplate.IMAGES_PATH === 'undefined') {
      this.notificationService.printErrorMessage("Template này hiện tại chưa có ảnh!");
      return;
    }
      
    else {
      let imgs = selectedTemplate.IMAGES_PATH.split(';');

      for (let item of imgs) {
        if(item !='')
          this.listImages.push(this.configService.getApiHost() + item);
      }
    }
    this.loadingBarService.complete();
    this.imageModal.show();
  }

  public viewDetail(template: PrdTemplate) {
    //console.log(this.chooseFileInput);
    this.addingTemplate = false;

    this.selectedTemplate = template;


    this.loadingBarService.complete();
    this.selectedTemplateLoaded = true;

    this.childModal.show();
    this.isViewDetail = true;
  }

  onChange(event: any, input: any) {
    this.listUploadImages = event.srcElement.files;
    //console.log(this.listUploadImages);
    let files = [].slice.call(event.target.files);
    input.value = files.map(f => f.name).join(', ');
  }



}