import {
  Component, OnInit, ViewChild, Input, Output,
  trigger,
  state,
  style,
  animate,
  transition, AfterViewChecked,
  ElementRef, 
  Directive
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
import { ContractModel } from "./contract";
import { User } from "../users/user"
import { DataService } from "./contract.service";
import { CMSCustomerMaster } from "../customers/cmscustomermaster";

import { CmAllCode} from '../cmallcode/cmallcode';
import { DataService as CusService } from "../customers/customers.service";
import { DataService as UserService } from "../users/user.service";
import { PrdProductService as ProService} from "../prdproducts/prdproducts.service";
import { ContractDetail } from "./contract-dt";
import { PrdProduct } from "../prdproducts/prdproducts";
import { RecordStatus } from "./record-status";
import { CmAllCodeService} from '../cmallcode/cmallcode.service';

declare var jQuery: any;

@Component({
  // moduleId: module.id,

  selector: 'contract',
  templateUrl: 'contract-list.component.html',

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
export class ContractListComponent implements AfterViewChecked {
  viewContractForm: NgForm;
  @ViewChild('viewContractForm') currentForm: NgForm;
  @ViewChild('childModal') public childModal: ModalDirective;
  contractModel: ContractModel[];
  contractDetail: ContractDetail[];
  selectedContractModel: ContractModel;
  apiHost: string;
  Customers: CMSCustomerMaster[];
  Users: User[];
  Products: PrdProduct[];
  SelectedProducts: PrdProduct[];
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public searchString: string;

  public contractSearch : ContractModel;
  public addContract: ContractModel;
  // Modal properties
  @ViewChild('modal')
  modal: any;
  items: string[] = ['item1', 'item2', 'item3'];
  selected: string;
  output: string;
  selectedContractId: number;
  selectedContractLoaded: boolean = false;
  index: number = 0;
  backdropOptions = [true, false, 'static'];
  animation: boolean = true;
  keyboard: boolean = true;
  backdrop: string | boolean = true;
  onEdit: boolean = false;
  public addingContractModel: boolean = false;
  checkAll: boolean;
  states : CmAllCode[];
  contractTypes : CmAllCode[];
  Status = [
    'Đang hoạt động', 
    'Duy trì',
    'Đã kết thúc',
    'Đang xem xét'
  ];

  formErrors = {
    'ContractCode': '',
    'CustomerId': '',
    'Value': '',
    'ExpContract': '',
    'SignContract': '',
    'ChargeDt': '',
    'MonthCharge': '',
    'Status': '',
    'DebitBalance': '',
    'PaidAmt': '',
    'DepositAccountBeforLd': '',
    'OptimalAmt': '',
    'SeoAmt': '',
    'DebitMaintainFee': '',
    'DepositAccount': '',
    'DepositLiquidation': ''
  };
  public isValid: boolean = true;
  validationMessages = {
    'ContractCode': {
      'required': 'Mã hợp đồng không được để trống',
      'maxlength': 'Mã hợp đồng phải từ 1-15 ký tự',
    },
    'CustomerId': {
      'required': 'Không được để trông khách hàng',
      'maxlength': 'Họ tên phải từ 1-70 ký tự',
    },
  'Value': {
  'required': 'Không được để trống trường giá trị',
  'maxilength' : 'Giá trị tối đa 18 chữ số'
    }, 
    'ExpContact': {
      'required': 'Không được để trống trường giá trị', 
      'pattern' : 'Giá trị nhập vào phải lớn hơn 0'
  }, 
    'SignContract' : {
      'required': 'Trường ngày ký là bắt buộc', 
      '': 'Ngày ký phải lớn hơn ngày hiện tại'
    },
    'ChargeDt' : {
      'required': 'Ngày tính phí là bắt buộc', 
      '': 'Ngày tính phí phải lớn hơn ngày ký'
    },
    'MonthCharge': {
      'required': 'Số tháng tính phí là bắt buộc', 
      'min': 'Số tháng tính phí phải lớn hơn 0'
    },
    'Status' : {
      'required': 'Trạng thái hợp đồng là bắt buộc', 
    }, 
    'DebitBalance' : {
      'required': 'Tài khoản ghi nợ là bắt buộc',
      'min' : "Tài khoản ghi nợ phải lớn hơn 0"
    },
    'PaidAMT' : {
      'required': 'Tiền đã thanh toán là bắt buộc',
      'min' : "Phải lớn hơn hoặc bằng không"
    }, 
    
  };
  constructor(
    private dataService: DataService,
    private cusService: CusService, 
    private userService: UserService,
    private proService : ProService,
private cmallCodeService : CmAllCodeService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private loadingBarService: SlimLoadingBarService,
    private membershipService: MembershipService,
    private router : Router
  ) {
    this.addContract = new ContractModel();
    this.searchString = '';
    this.checkAll = false;
    this.contractSearch = new ContractModel();
    this.contractSearch.SignContractDt = null;
    this.states = new Array<CmAllCode>();
  }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.dataService.setToken(this.membershipService.getTokenUser());
    this.cusService.setToken(this.membershipService.getTokenUser());
    this.proService.setToken(this.membershipService.getTokenUser());
    this.cmallCodeService.setToken(this.membershipService.getTokenUser());
    this.loadContracts('');

    //console.log(this.dataService._token);

    this.loadStates();
    this.loadContractTypes();
  }
  search(searchstring: string) {
    if(!searchstring)
      searchstring = '';
    this.currentPage = 1;
    this.loadContracts(searchstring);
  }

  loadContracts(searchString?: string) {
    this.loadingBarService.start();

    this.dataService.getContracts(this.currentPage, this.itemsPerPage, searchString)
      .subscribe((res: PaginatedResult<ContractModel[]>) => {
          this.contractModel = res.result;// schedules;

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
    if (!this.searchString)
      this.loadContracts('');
    else
      this.loadContracts(this.searchString);

  };

  ngAfterViewChecked(): void {
    this.formChanged();
    
  }
  formChanged() {
    if (this.currentForm === this.viewContractForm) { return; }
    this.viewContractForm = this.currentForm;
    if (this.viewContractForm) {
      this.viewContractForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (!this.viewContractForm) { return; }
    const form = this.viewContractForm.form;
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
  addNewContract(contract: ContractModel) {
    var _user = this.membershipService.getLoggedInUser();
    contract.MakerId = _user.Username;

    //console.log(domain);
    this.loadingBarService.start();

    var contractDt: ContractDetail[] = Array<ContractDetail>();

    for (let item of this.Products) {
      if (item.RecordStatus == '1') {
        var cd = new ContractDetail();
        cd.ContractId = contract.ContractId;
        cd.ProductId = item.ProductId;
        contractDt.push(cd);
      }
    }

    this.dataService.createContract(contract, contractDt)
      .subscribe(rs => {
          if (rs.Succeeded) {
            this.notificationService.printSuccessMessage(rs.Message);
            this.contractModel.push(contract);
            this.addContract = new ContractModel();
            this.loadContracts('');
          }
          else {
            this.notificationService.printErrorMessage(rs.Message);
          }
          //this.notificationService.printSuccessMessage('Thêm domain thành công');
          this.hideChildModal();
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

          //   // this.utilityService.navigateToSignIn();

          // }
          // this.loadingBarService.complete();
          // this.notificationService.printErrorMessage('Lỗi- ' + error);
        });
  }

  //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
  //this.loadSchedules();
  
  viewAddContract() {
    //this.onEdit = false;
    //this.addContract = new ContractModel();
    //this.selectedContractModel = new ContractModel();
    //this.addingContractModel = true;
    //this.loadingBarService.complete();
    //this.selectedContractLoaded = true;
    //this.childModal.show();

    this.router.navigate(["/contractoperator/a"]);

  }

  deleteContract(contract: ContractModel) {
    //console.log(domain);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
      () => {
        this.loadingBarService.start();
        this.dataService.deleteContract(contract.ContractId)
          .subscribe(rs => {
              if (rs.Succeeded) {
                this.notificationService.printSuccessMessage(rs.Message);
                this.itemsService.removeItemFromArray<ContractModel>(this.contractModel, contract);
              }
              else {                                                                  
                this.notificationService.printErrorMessage(rs.Message);
              }

              //this.notificationService.printSuccessMessage('Xóa domain thành công');
              this.hideChildModal();
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
  editContract(contract: ContractModel) {
    //console.log(domain);

    var contractDt: ContractDetail[] = new Array<ContractDetail>();

    for (let item of this.Products) {
      if (item.RecordStatus == '1') {
        var cd = new ContractDetail();
        cd.ContractId = contract.ContractId;
        cd.ProductId = item.ProductId;
        contractDt.push(cd);
      }
    }

    //console.log(this.selectedManageUser);
    var _user = this.membershipService.getLoggedInUser();
    this.selectedContractModel.EditorId = _user.Username;
    this.loadingBarService.start();
    this.onEdit = true;
    this.dataService.updateContract(this.selectedContractModel, contractDt)
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
  }

  public viewContractDetails(contract: ContractModel): void {
    this.addingContractModel = false;

    this.selectedContractModel = contract;

    var contractDt: ContractDetail[] = [];

    this.LoadProds();

    this.LoadCustomers();

    this.dataService.getContractDtByContractId(contract.ContractId).subscribe((res:ContractDetail[]) => {
        contractDt = res;
      
        for (let item of contractDt) {
          if (this.Products.some(x => x.ProductId == item.ProductId)) {
            this.Products.find(x => x.ProductId == item.ProductId).RecordStatus = '1';
            this.SelectedProducts.push(this.Products.find(x => x.ProductId == item.ProductId));
          }
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
      // this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
    });
    


    this.loadingBarService.complete();
    this.selectedContractLoaded = true;

    this.childModal.show();
  }
  
  public hideChildModal(): void {
    this.childModal.hide();
  }

  public LoadCustomers() {
    this.loadingBarService.start();
    this.cusService.getCustomers(1, 100, '').subscribe((res:PaginatedResult <CMSCustomerMaster[]>) => {
      this.Customers = res.result;
      this.loadingBarService.complete();
    }, error => {
      this.loadingBarService.complete();
      this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
    });
  }

  public LoadUsers() {
    this.loadingBarService.start();
    this.userService.getUsers().subscribe((res: PaginatedResult<User[]>) => {
      this.Users = res.result;
      this.loadingBarService.complete();
    }, error => {
      this.loadingBarService.complete();
      this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
    });
  }

  public LoadProds() {
    this.loadingBarService.start();
    this.proService.getAllProducts().subscribe((res: PrdProduct[]) => {

      this.Products = res;

      for (let p of this.Products) {
        p.RecordStatus = '0';
      }

     //for (var i = 0; i < this.Products.length; i++) {
     //  let r = new RecordStatus();
     //  r.Chekced = false;
     //  r.ProductID = this.Products[i].ProductId;
     //  this.ReS[i] = r;
     //}
      
     this.loadingBarService.complete();
    }, error => {
      // this.loadingBarService.complete();
      // this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
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
    });
  }

  public changeCheck(e) {
    if (e.target.checked) {
      for (let item of this.Products) {
        item.RecordStatus = '1';
      }
    } else {
      for (let item of this.Products) {
        item.RecordStatus = '0';
      }
    }
    
  }


  lookupContract() {
    this.loadingBarService.start();
    this.dataService.filter(this.contractSearch).subscribe(res => {
        this.contractModel = res.result; // schedules;
        this.totalItems = res.pagination.TotalItems;

        this.loadingBarService.complete();
      },
      error => {
        this.loadingBarService.complete();
        this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
      });
  }

  loadStates() {
    this.cmallCodeService.getTypeByCode('STATUS').subscribe(res => {
        this.states = res;
      },
      error => {
        this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
      });
  }

  loadContractTypes() {
    this.cmallCodeService.getTypeByCode('CONTRACT_TYPE').subscribe(res => {
        this.contractTypes = res;
      },
      error => {
        this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
      });
  }
}