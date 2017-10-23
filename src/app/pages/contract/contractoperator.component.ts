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

import { ActivatedRoute } from '@angular/router';

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

import { DataService as CusService } from "../customers/customers.service";
import { DataService as UserService } from "../users/user.service";
import { PrdProductService as ProService } from "../prdproducts/prdproducts.service";
import { ContractDetail } from "./contract-dt";
import { PrdProduct } from "../prdproducts/prdproducts";
import { RecordStatus } from "./record-status";
import { ContractViewModel } from "./contractviewmodel"
import { PrdProductViewModel } from "../prdproducts/prdproductviewmodel";
import { CmAllCode } from "../cmallcode/cmallcode";
import { CmAllCodeService as AllCodeService } from "../cmallcode/cmallcode.service"
import { DataService as ContractFileUploadService } from "../contractfileupload/contractfileupload.service"
import { CmsContractFileUpload } from "../contractfileupload/cmscontractfileupload"


@Component({
  // moduleId: module.id,

  selector: 'contract',
  templateUrl: 'contractoperator.component.html',

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

export class ContractOperatorComponent implements AfterViewChecked {

  viewContractForm: NgForm;

  @ViewChild('viewContractForm') currentForm: NgForm;

  @ViewChild('childModal') public childModal: ModalDirective;

  @ViewChild('ContractUpload') contractUpload: ElementRef;

  @ViewChild('FileUpload') fileUpload: ElementRef;

  @ViewChild('tBodyContractUpload') tbodyContractUpload: ElementRef;

  @ViewChild('tBodyFileUpload') tbodyFileUpload: ElementRef;

  @ViewChild('modal') modal: any;

  contractModel: ContractModel;

  Customers: CMSCustomerMaster[];

  Products: PrdProduct[];

  SelectedProducts: PrdProduct[];

  // Contracct Type lists
  ContractTypes: CmAllCode[];

  ContractFileUploadList: CmsContractFileUpload[];

  FileUploadList: CmsContractFileUpload[];

  ContractFiles: File[];

  Files: File[];

  apiHost: string;

  // Process type form 
  // a : add contract 
  // e : edit contract
  // v : view contract
  type: string;

  // id contract
  contractId: string;

  invalidDate: boolean = false;
  messageValidDate: string;

  // Trạng thái
  Status: CmAllCode[];
  
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
      'maxlength': 'Mã hợp đồng phải từ 1-50 ký tự',
    },
    'CustomerId': {
      'required': 'Không được để trông khách hàng',
      'maxlength': 'Họ tên phải từ 1-70 ký tự',
    },
    'Value': {
      'required': 'Không được để trống trường giá trị',
      'maxilength': 'Giá trị tối đa 18 chữ số',
      'pattern': "Giá trị phải lớn hơn 0"
    },
    'ExpContact': {
      'required': 'Không được để trống trường giá trị',
      'maxilength': 'Giá trị tối đa 18 chữ số',
      'pattern': 'Giá trị nhập vào phải lớn hơn 0',

    },
    'SignContract': {
      'required': 'Trường ngày ký là bắt buộc',
      '': 'Ngày ký phải lớn hơn ngày hiện tại'
    },
    'ChargeDt': {
      'required': 'Ngày tính phí là bắt buộc',
      'pattern': 'Ngày tính phí phải lớn hơn ngày ký'
    },
    'MonthCharge': {
      'required': 'Số tháng tính phí là bắt buộc',
      'maxilength': 'Giá trị tối đa 18 chữ số',
      'pattern': 'Số tháng tính phí phải lớn hơn 0'
    },
    'Status': {
      'required': 'Trạng thái hợp đồng là bắt buộc',
    },
    'DebitBalance': {
      'required': 'Tài khoản ghi nợ là bắt buộc',
      'maxilength': 'Giá trị tối đa 18 chữ số',
      'pattern': "Tài khoản ghi nợ phải lớn hơn 0"
    },
    'PaidAMT': {
      'required': 'Tiền đã thanh toán là bắt buộc',
      'maxilength': 'Giá trị tối đa 18 chữ số',
      'pattern': "Phải lớn hơn hoặc bằng không"
    },

  };

  constructor(
    private dataService: DataService,
    private cusService: CusService,
    private userService: UserService,
    private proService: ProService,
    private allCodeService: AllCodeService,
    private contractFileUploadService: ContractFileUploadService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private loadingBarService: SlimLoadingBarService,
    private membershipService: MembershipService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef) {

    this.contractModel = new ContractModel();
    this.SelectedProducts = new Array<PrdProduct>();
    this.Products = new Array<PrdProduct>();
    this.Customers = new Array<CMSCustomerMaster>();
    this.ContractFileUploadList = new Array<CmsContractFileUpload>();
    this.FileUploadList = new Array<CmsContractFileUpload>();
    this.ContractFiles = new Array<File>();
    this.Files = new Array<File>();
  }


  ngOnInit() {

    this.route.params.subscribe(params => { this.type = params['type'], this.contractId = params['contractId'] });

    this.apiHost = this.configService.getApiHost();
    this.dataService.setToken(this.membershipService.getTokenUser());
    this.cusService.setToken(this.membershipService.getTokenUser());
    this.proService.setToken(this.membershipService.getTokenUser());
    this.allCodeService.setToken(this.membershipService.getTokenUser());
    this.contractFileUploadService.setToken(this.membershipService.getTokenUser());
    this.LoadByType(this.type, this.contractId);



    //console.log(this.dataService._token);
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
        this.validDate();
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

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

  LoadByType(type: string, contractId: string) {
    this.LoadContractTypes();
    switch (type) {
      case 'a':
        this.LoadAddContract();
        break;
      case 'e':
        this.LoadEditContract(contractId);
        break;
      case 'v':
        this.LoadViewContract(contractId);
        break;
      default:
        this.router.navigate(["/contractlist"]);
        break;
    }

    

    this.LoadStatus();

  }

  LoadAddContract() {

  }

  LoadEditContract(contractId: string) {
    this.loadingBarService.start();

    this.LoadCustomers();

    this.dataService.getContract(contractId).subscribe((res: ContractModel) => {

      this.contractModel = res;

      this.set0();

      this.loadSelectedProducts();

      this.LoadViewContractFileUpload(contractId);

      this.LoadViewFileUpload(contractId);

    }, error => {
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

  }

  set0() {
    if (this.contractModel.Value == null) {
      this.contractModel.Value = 0;
    }
    if (this.contractModel.ExpContract == null) {
      this.contractModel.ExpContract = 0;
    }
    if (this.contractModel.MonthCharge == null) {
      this.contractModel.MonthCharge = 0;
    }
  }


  LoadViewContractFileUpload(contractId: string) {
      this.contractFileUploadService.getContractFileUploadById(contractId, "C")
          .subscribe(res => {
              if (res.Succeeded) {
                  this.ContractFileUploadList = res.Data;
                  //console.log(res.Data);
                  //console.log(this.ContractFileUploadList);
                  this.notificationService.printSuccessMessage(res.Message);
              } else {
                  this.notificationService.printErrorMessage(res.Message);
              }
          });
  }

  LoadViewFileUpload(contractId: string) {

      this.contractFileUploadService.getContractFileUploadById(contractId, "O")
          .subscribe(res => {
              if (res.Succeeded) {
                  this.FileUploadList = res.Data;
                  //console.log(res.Data);
                  //console.log(this.FileUploadList);
                  this.notificationService.printSuccessMessage(res.Message);
              } else {
                  this.notificationService.printErrorMessage(res.Message);
              }
          });
  }

  LoadViewContract(contractId: string) {
    this.loadingBarService.start();

    this.dataService.getContract(contractId).subscribe((res: ContractModel) => {
      this.contractModel = res;

      this.loadSelectedProducts();

      this.LoadViewContractFileUpload(contractId);

      this.LoadViewFileUpload(contractId);

    }, error => {
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

  }


  public LoadCustomers() {
    this.loadingBarService.start();
    this.cusService.getCustomers(1, 100, '').subscribe((res: PaginatedResult<CMSCustomerMaster[]>) => {
      this.Customers = res.result;
      this.loadingBarService.complete();
    }, error => {
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

  public validDate() {
    this.isValid = (this.contractModel.ChargeDt >= this.contractModel.SignContractDt);
    if (!this.isValid) {
      this.invalidDate = true;
      this.messageValidDate = 'Ngày tính phí phải lớn hơn ngày ký hợp đồng';
    } else {
      this.invalidDate = false;
    }
  }

  addNewContract() {

    this.loadingBarService.start();

    var _user = this.membershipService.getLoggedInUser();
    this.contractModel.MakerId = _user.Username;

    //console.log(domain);


    var contractDt: ContractDetail[] = new Array<ContractDetail>();

    for (let item of this.SelectedProducts) {

      var cd = new ContractDetail();
      cd.ContractId = this.contractModel.ContractId;
      cd.ProductId = item.ProductId;
      cd.MakerId = _user.Username;
      contractDt.push(cd);
    }

 

    this.dataService.createContract(this.contractModel, contractDt)
      .subscribe(rs => {
        if (rs.Succeeded) {
          this.dataService.getByCode(this.contractModel.ContractCode)
            .subscribe(res => {
              var con = res;
              this.contractId = con.ContractId;
              this.AttachFiles();
            });
          this.router.navigate(['/pages/contract/contractlist']);
          this.notificationService.printSuccessMessage(rs.Message);
          this.loadingBarService.complete();
        }
        else {
          this.notificationService.printErrorMessage(rs.Message);
        }
        //this.notificationService.printSuccessMessage('Thêm domain thành công');
        this.loadingBarService.complete();


      },
      error => {
        if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

          // this.utilityService.navigateToSignIn();

        }
        this.loadingBarService.complete();
        this.notificationService.printErrorMessage('Lỗi- ' + error);
      });
  }

  public AttachFiles(): void {
      if(this.ContractFiles != null)
      {
        if(this.ContractFiles.length >0)
        {
          this.contractFileUploadService.UploadContractFileUpload(this.contractId, this.ContractFiles)
          .subscribe(res => {
          if (res.Succeeded) {
            this.notificationService.printSuccessMessage(res.Message);
            this.ContractFileUploadList = res.Data;
          } else {
            this.notificationService.printErrorMessage(res.Message);
          }
        });
        }
      }
    if(this.Files != null)
      {  
    if(this.Files.length >0)
      {
    this.contractFileUploadService.UploadFiles(this.contractId, this.Files)
      .subscribe(res => {
        if (res.Succeeded) {
          this.notificationService.printSuccessMessage(res.Message);
          this.FileUploadList = res.Data;
        } else {
          this.notificationService.printErrorMessage(res.Message);
        }
      });
    }
  }
    var listFiles = this.ContractFileUploadList.concat(this.FileUploadList);
    if(listFiles != null)
    {
      if(listFiles.length >0)
        {
    this.contractFileUploadService.updateContractFileUpload(this.contractId, listFiles)
      .subscribe(res => {
        if (res.Succeeded) {
          this.notificationService.printSuccessMessage(res.Message);
        } else {
          this.notificationService.printErrorMessage(res.Message);
        }
      });
      }
  }

  }

  public loadSelectedProducts(): void {

    var contractDt: ContractDetail[] = [];

    this.dataService.getContractDtByContractId(this.contractModel.ContractId).subscribe((res: ContractDetail[]) => {

      contractDt = res;

      for (let item of contractDt) {
        this.LoadProduct(item.ProductId);
      }
    },
      error => {
        this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
      });


    this.loadingBarService.complete();
  }

  public LoadProduct(productId: string) {
    this.loadingBarService.start();

    this.proService.getProductFullDetail(productId).subscribe((res: PrdProductViewModel) => {

      var product: PrdProduct = res.PrdProduct;

      if (product != null)
        this.SelectedProducts.push(product);

      //for (var i = 0; i < this.Products.length; i++) {
      //  let r = new RecordStatus();
      //  r.Chekced = false;
      //  r.ProductID = this.Products[i].ProductId;
      //  this.ReS[i] = r;
      //}

    }, error => {
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

    this.loadingBarService.complete();

  }


  public hideChildModal(): void {
    this.childModal.hide();
  }

  public showChildModal(): void {
    this.childModal.show();
  }
  public DeleteSelectedProduct(product: PrdProduct): void {
    let index = this.SelectedProducts.indexOf(product);
    this.SelectedProducts.splice(index, 1);
    this.Products.find(n => n.ProductId == product.ProductId).RecordStatus = '0';

  }

  public searchProducts(searchString: string): void {

    this.loadingBarService.start();

    this.proService.getAllProducts(searchString).subscribe((res: PrdProduct[]) => {

      this.Products = res;

      //var rePros = this.Products.reduce((function (pre, cur, i) {
      //  cur.RecordStatus = '0';
      //  pre[i] = cur;
      //  return pre;
      //}, {});
      //  this.Products = rePros;
      for (let item of this.Products) {
        item.RecordStatus = '0';
      }
      //for (let item of this.Products) {
      //  console.log(item.RecordStatus);
      //}

      for (let item of this.SelectedProducts) {
        if (this.Products.some(n => n.ProductId == item.ProductId))
          this.Products.find(n => n.ProductId == item.ProductId).RecordStatus = '1';
      }

    },
      error => {
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
    this.loadingBarService.complete();
  }

  public selectProduct(product: PrdProduct): void {
    if (!this.SelectedProducts.some(n => n.ProductId == product.ProductId)) {
      this.SelectedProducts.push(product);
      this.Products.find(n => n.ProductId == product.ProductId).RecordStatus = '1';
    }
    else {
      alert('Sản phẩm này đã được thêm vào!');
    }
  }


  public editContract(): void {
    this.loadingBarService.start();

    var _user = this.membershipService.getLoggedInUser();
    this.contractModel.EditorId = _user.Username;

    var contractDt: ContractDetail[] = new Array<ContractDetail>();

    for (let item of this.SelectedProducts) {
      var cd = new ContractDetail();
      cd.ContractId = this.contractModel.ContractId;
      cd.ProductId = item.ProductId;
      cd.MakerId = _user.Username;
      contractDt.push(cd);
    }
    //console.log(this.selectedManageUser);

    this.contractFileUploadService.UploadContractFileUpload(this.contractId, this.ContractFiles)
      .subscribe(res => {
          if (res.Succeeded) {
            this.notificationService.printSuccessMessage(res.Message);
            this.ContractFileUploadList = res.Data;
          } else {
            this.notificationService.printErrorMessage(res.Message);
          }
        });
    this.contractFileUploadService.UploadFiles(this.contractId, this.Files)
      .subscribe(res => {
        if (res.Succeeded) {
          this.notificationService.printSuccessMessage(res.Message);
          this.FileUploadList = res.Data;
        } else {
          this.notificationService.printErrorMessage(res.Message);
        }
      });

    var listFiles = this.ContractFileUploadList.concat(this.FileUploadList);

    this.contractFileUploadService.updateContractFileUpload(this.contractId, listFiles)
      .subscribe(res => {
        if (res.Succeeded) {
          this.notificationService.printSuccessMessage(res.Message);
        } else {
          this.notificationService.printErrorMessage(res.Message);
        }
      });

    this.dataService.updateContract(this.contractModel, contractDt)
      .subscribe(res => {
        if (res.Succeeded) {
          this.notificationService.printSuccessMessage(res.Message);
          this.router.navigate(['/pages/contract/contractlist']);
        }
        else {
          this.notificationService.printErrorMessage(res.Message);
        }
        //this.notificationService.printSuccessMessage('Domain đã được cập nhật');

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
        // this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
      });

    this.loadingBarService.complete();

  }

  public LoadContractTypes(): void {

    this.allCodeService.getTypeByCode('CONTRACT_TYPE').subscribe(res => {

      this.ContractTypes = res;

    }, error => {
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
      // this.notificationService.printErrorMessage('Tải thất bại ' + error);
    });

  }

  public LoadStatus(): void {
    this.allCodeService.getTypeByCode('STATUS').subscribe(res => {

      this.Status = res;

    }, error => {
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
      // this.notificationService.printErrorMessage('Tải thất bại ' + error);
    });

  }

  public unselectedProduct(product: PrdProduct): void {

  }


  public ContractUploadOnChange(event: any): void {

      this.ContractFileUploadList = [];
      this.ContractFiles = [];

    var fileNatives = event.srcElement.files;
    for (let item of fileNatives) {
      this.ContractFiles.push(item);
    }
    let files = [].slice.call(event.target.files);

    var user = this.membershipService.getLoggedInUser();

    for (let item of files) {
      let cms: CmsContractFileUpload = new CmsContractFileUpload();
      cms.FILE_NAME = item.name;
      cms.FILE_SIZE = item.size;
      cms.FILE_TYPE = item.type;
      cms.CREATE_DT = new Date();
      cms.MAKER_ID = user.Username;
      cms.CONTRACT_ID = this.contractId;
      cms.TYPE = "C";
      this.ContractFileUploadList.push(cms);
    }

    //let files = [].slice.call(event.target.files);
    //console.log(files);

    //var template = '';

    //var i = 1;

    //for (let f of files) {
    //    console.log(f);
    //    template += '<tr><th scope="row">';
    //    template += i;
    //    template+= '</th><td>'
    //    template += f.name;
    //    template += '</td><td>';
    //    template += f.size;
    //    template += '</td><td>';
    //    template += '<input type="text" class="form-control" name="ContractUpload.Notes" id="ContractUpload.Notes"/></td>';
    //    template += '</tr>';
    //    //template += '<td ><span class="fa fa-remove" style="cursor:pointer" onclick="deleteContractUploadRow(this)"></span></td></tr>';
    //    i++;

    //}

    //this.tbodyContractUpload.nativeElement.innerHTML = template;

  }

  public FileUploadOnChange(event: any): void {
      this.FileUploadList = [];
      this.Files = [];
    var fileNatives = event.srcElement.files;

    for (let item of fileNatives) {
      this.Files.push(item);
    }

    let files = [].slice.call(event.target.files);

    var user = this.membershipService.getLoggedInUser();

    for (let item of files) {
      let cms: CmsContractFileUpload = new CmsContractFileUpload();
      cms.FILE_NAME = item.name;
      cms.FILE_SIZE = item.size;
      cms.FILE_TYPE = item.type;
      cms.CREATE_DT = new Date();
      cms.MAKER_ID = user.Username;
      cms.CONTRACT_ID = this.contractId;
      cms.TYPE = "O";
      this.FileUploadList.push(cms);
    }

  }

  public deleteContractUploadRow(file: any): void {
    var index = this.ContractFileUploadList.indexOf(file);

    this.ContractFileUploadList.splice(index, 1);

    this.ContractFiles.splice(index, 1);

  }

  public deleteFileUploadRow(file: any): void {

    var index = this.FileUploadList.indexOf(file);

    this.FileUploadList.splice(index, 1);

    this.Files.splice(index, 1);

  }
  
}



