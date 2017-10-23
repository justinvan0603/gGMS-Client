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
import { CMSCustomerMaster } from "./cmscustomermaster";
import { DataService } from "./customers.service";

@Component({
    // moduleId: module.id,

    selector: 'customers',
    templateUrl: 'customers-list.component.html',

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
    ],styles:[`td
{
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}`]

    
    
})
export class CustomerListComponent implements AfterViewChecked {
    viewCustomerForm : NgForm;
    @ViewChild('viewCustomerForm') currentForm: NgForm;
    @ViewChild('childModal') public childModal: ModalDirective;
    customers: CMSCustomerMaster[];
    selectedCustomer: CMSCustomerMaster;
    apiHost: string;
    public isViewDetail: boolean= false;
    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;
    public searchString : string;
    public addCustomer:CMSCustomerMaster;
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedCustomerId: number;
    selectedCustomerLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    public addingCustomer: boolean = false;

    formErrors = {
    'CustomerCode': '',
    'CustomerName' : '',
    'PhoneNumber' : '',
    'Email' : '',
    'TaxCode' : '',
    'CompanyName' : '',
    'Address' : '',
 
  };
  public isValid: boolean = true;
  validationMessages = {
    'CustomerCode': {
      'required':      'Mã khách hàng không được để trống', 
      'maxlength':     'Mã khách hàng phải từ 1-15 ký tự',
      
    },
    'CustomerName': {
      'required':      'Họ tên không được để trống', 
      'maxlength':     'Họ tên phải từ 1-70 ký tự',
    }
    ,
    'PhoneNumber': {
      'required':      'Số điện thoại không được để trống', 
      'maxlength':     'Số điện thoại phải từ 1-20 ký tự',
      'pattern': 'Số điện thoại không hợp lệ'
    }
    ,
    'Email': {
      'required':      'Email không được để trống', 
      'pattern':     'Email không hợp lệ',
    }
    ,
    'TaxCode': {
      'required':      'Mã số thuế không được để trống', 
      'maxlength':     'Mã số thuế phải từ 1-200 ký tự',
      'pattern': 'Mã số thuế không hợp lệ'
    }
    ,
    'CompanyName': {
      'required':      'Tên công ty không được để trống', 
      'maxlength':     'Tên công ty phải từ 1-200 ký tự',
    }
    ,
    'Address': {
      'required':      'Tên địa chỉ không được để trống', 
      'maxlength':     'Tên địa chỉ phải từ 1-500 ký tự',
    }
  };
    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
 
        private membershipService:MembershipService
        ) {this.addCustomer = new CMSCustomerMaster(); 
        this.searchString = ''; }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
         this.dataService.setToken(this.membershipService.getTokenUser());
        this.loadCustomers('');
      
        //console.log(this.dataService._token);
        
    }
    search(searchstring: string)
    {
        if(!searchstring)
            searchstring = '';
        this.currentPage = 1;
        this.loadCustomers(searchstring);
    }
    
    loadCustomers(searchString?:string) {
        this.loadingBarService.start();
        
        this.dataService.getCustomers(this.currentPage, this.itemsPerPage,searchString)
            .subscribe((res: PaginatedResult<CMSCustomerMaster[]>) => {
                this.customers = res.result;// schedules;
        
                this.totalItems = res.pagination.TotalItems;
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
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
            });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
        if(!this.searchString)
            this.loadCustomers('');
        else
            
            this.loadCustomers(this.searchString);

    };

ngAfterViewChecked(): void {
            this.formChanged();
    }
    formChanged()
    {
         if (this.currentForm === this.viewCustomerForm) { return; }
         this.viewCustomerForm = this.currentForm;
         if(this.viewCustomerForm)
         {
            this.viewCustomerForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
         }
    }
    onValueChanged(data?: any)
    {
        if (!this.viewCustomerForm) { return; }
        const form = this.viewCustomerForm.form;
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
    addNewCustomer(customer: CMSCustomerMaster) {
        var _user = this.membershipService.getLoggedInUser();
        customer.MakerId = _user.Username;

        //console.log(domain);
        this.loadingBarService.start();
       
        this.dataService.createCustomer(customer)
            .subscribe(rs=> {
                if(rs.Succeeded)
                {
                    this.notificationService.printSuccessMessage(rs.Message);
                     //this.customers.push(customer);
                    this.addCustomer =new CMSCustomerMaster();
                    this.loadCustomers('');
                    this.hideChildModal();
                }
                else
                {
                    this.notificationService.printErrorMessage(rs.Message);
                }
                //this.notificationService.printSuccessMessage('Thêm domain thành công');
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
                // if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                //    // this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Lỗi- ' + error);
            });
        }

   //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
            //this.loadSchedules();
    

    viewAddCustomer() {
        this.isViewDetail = false;
        this.onEdit = false;
        this.addCustomer = new CMSCustomerMaster();
        this.selectedCustomer = new CMSCustomerMaster();
        this.addingCustomer = true;
        this.loadingBarService.complete();
        this.selectedCustomerLoaded = true;
        this.childModal.show();

    }
deleteCustomer(customer:CMSCustomerMaster)
{
    //console.log(domain);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
            () => {
                this.loadingBarService.start();
                this.dataService.deleteCustomer(customer.CustomerId)
                    .subscribe(rs => {
                        if(rs.Succeeded)
                        {
                            this.notificationService.printSuccessMessage(rs.Message);
                            this.itemsService.removeItemFromArray<CMSCustomerMaster>(this.customers, customer);
                        }
                        else
                        {
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
                //         if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                //     this.utilityService.navigateToSignIn();

                // }
                //         this.loadingBarService.complete();
                //         this.notificationService.printErrorMessage('Lỗi ' + ' ' + error);
                    });
            });
}
editCustomer(customer: CMSCustomerMaster) {
        //console.log(domain);
        
        //console.log(this.selectedManageUser);
        var _user = this.membershipService.getLoggedInUser();
        this.selectedCustomer.EditorId = _user.Username;
        this.loadingBarService.start();
        this.onEdit = true;
        this.dataService.updateCustomer(this.selectedCustomer)
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
                // if (error.status == 401 || error.status == 302 ||error.status==0 || error.status==404) {

                //     //this.utilityService.navigateToSignIn();

                // }
                // this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
            });
        }


    

    public viewCustomerDetails(customer: CMSCustomerMaster): void {
        this.isViewDetail = false;
        this.addingCustomer = false;

        this.selectedCustomer = customer;


        this.loadingBarService.complete();
        this.selectedCustomerLoaded = true;

        this.childModal.show();
    }


    public hideChildModal(): void {
        this.childModal.hide();
    }
    public viewDetail(customer: CMSCustomerMaster)
    {
        this.addingCustomer = false;

        this.selectedCustomer = customer;


        this.loadingBarService.complete();
        this.selectedCustomerLoaded = true;

        this.childModal.show();
        this.isViewDetail = true;
    }
}