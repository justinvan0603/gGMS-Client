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
import { ItemsService } from '../shared/utils/items.service';
import { ConfigService } from '../shared/utils/config.service';
import { Pagination, PaginatedResult } from '../shared/interfaces';
import { NotificationService } from "../shared/utils/notification.service";

import { NgForm } from "@angular/forms";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";

import { Paginated } from "../messages/paginated";
import { PrjProjectOvervieweCommercesService } from "./prdcategories.service";
import {PrjProjectOvervieweCommerces} from "./prjproject-overviewecommerces";
import {DataService} from "./prjproject.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PrjProject} from "./prjproject";
import {PrjProjectDt} from "./prjproject-dt";
import {PrjProductListPerformanceEcommerce} from "./prjproject-productlist-performancecommerces";

@Component({
  // moduleId: module.id,
  selector: 'PrjProjectOvervieweCommerces',
  templateUrl: 'prjproject-overviewecommerces.component.html',

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
export class PrjProjectOvervieweCommercesComponent extends Paginated {
  viewPrjProjectOvervieweCommercesForm: NgForm;
  @ViewChild('viewPrjProjectOvervieweCommercesForm')
  currentForm: NgForm;
  @ViewChild('childModal')
  public childModal: ModalDirective;
  public prjProjectOvervieweCommerces: PrjProjectOvervieweCommerces[];
  public prjProductListPerformanceEcommerce: PrjProductListPerformanceEcommerce[];

  selectedPrjProjectOvervieweCommerces: PrjProjectOvervieweCommerces;
  categoriesParentList: PrjProjectOvervieweCommerces[];
  apiHost: string;
  public isViewDetail: boolean = false;
  public itemsPerPage: number = 10;


  public totalItems: number = 0;
  public currentPage: number = 1;
  public totalItemsProductListPerformanceEcommerce: number = 0;
  public currentPageProductListPerformanceEcommerce: number = 1;
  public searchString: string;

  public addPrjProjectOvervieweCommerces: PrjProjectOvervieweCommerces;
  @ViewChild('modal')
  modal: any;
  items: string[] = ['item1', 'item2', 'item3'];
  selected: string;
  output: string;
  selectedPrjProjectOvervieweCommercesId: number;
  selectedPrjProjectOvervieweCommercesLoaded: boolean = false;
  index: number = 0;
  backdropOptions = [true, false, 'static'];
  animation: boolean = true;
  keyboard: boolean = true;
  backdrop: string | boolean = true;
  onEdit: boolean = false;
  public addingPrjProjectOvervieweCommerces: boolean = false;

  type: string;
  projectId: string;

  contractId:string;
  formErrors = {
    'PrjProjectOvervieweCommercesCode': '',
    'PrjProjectOvervieweCommercesName': '',
    'PrjProjectOvervieweCommercesLevel': ''

  };
  public isValid: boolean = true;
  validationMessages = {
    'PrjProjectOvervieweCommercesCode': {
      'required': 'Mã lĩnh vực không được để trống',
      'maxlength': 'Mã lĩnh vực phải từ 1-15 ký tự',
    },
    'PrjProjectOvervieweCommercesName': {
      'required': 'Tên lĩnh vực không được để trống',
      'maxlength': 'Tên lĩnh vực phải từ 1-200 ký tự',
    },
    'PrjProjectOvervieweCommercesLevel': {
      'required': "Cấp độ lĩnh vực không được để trống",
      'pattern': 'Phải là số không âm'
    }


  };

  constructor(
    private dataService: DataService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private loadingBarService: SlimLoadingBarService,
    private membershipService: MembershipService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(0, 0, 0);
    this.addPrjProjectOvervieweCommerces = new PrjProjectOvervieweCommerces();
    this.searchString = '';
  }

  ngOnInit() {
  //  this.dataService.set(12);
    this.route.params.subscribe(params => { this.type = params['type'], this.projectId = params['projectId'] });



    this.apiHost = this.configService.getApiHost();
    this.dataService.setToken(this.membershipService.getTokenUser());
  //  this.loadCategories('');

    this.loadByType(this.type, this.projectId);
  }

  loadByType(type: string, contractId: string) {
    // this.loadContractTypes();
    // this.loadStates();
    // this.loadContracts();
    switch (type) {
      // case 'a':
      //   this.loadAddProject();
      //   break;
      // case 'e':
      //   this.loadEditProject(contractId);
      //   break;
      case 'o':
        this.contractId = contractId;
        this.loadViewProjectOvervieweCommerces(contractId,'');
        this.loadViewProductListPerformanceEcommerce(contractId,'');

        break;
      default:
        this.router.navigate(['/pages/prjproject/prjprojectlist']);
        break;
    }

  }


  // search(i): void {
  //   super.search(i);
  //   if (!this.searchString)
  //     this.loadCategories('');
  //   else
  //     this.loadCategories(this.searchString);
  // };
  //
  searchitem(searchstring: string) {
    console.log(this.searchString);
    if (!searchstring)
      searchstring = '';
    this.loadViewProjectOvervieweCommerces(this.contractId,searchstring);
  }

  searchitemProductListPerformanceEcommerce(searchstring: string) {
    console.log(this.searchString);
    if (!searchstring)
      searchstring = '';
    this.loadViewProductListPerformanceEcommerce(this.contractId,searchstring);
  }



  loadViewProjectOvervieweCommerces(projectId: string,searchString?: string) {
    this.loadingBarService.start();

    this.dataService.getPrjProjectOvervieweCommercesById(this.projectId,this.currentPage, this.itemsPerPage, searchString)
      .subscribe((res: PaginatedResult<PrjProjectOvervieweCommerces[]>) => {

          //          console.log(res);
          this.prjProjectOvervieweCommerces = res.result;// schedules;

          this.totalItems = res.pagination.TotalItems;
          this.loadingBarService.complete();
        },
        error => {
          this.loadingBarService.complete();
          this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
        });

  }

  loadViewProductListPerformanceEcommerce(projectId: string,searchString?: string) {
    this.loadingBarService.start();

    this.dataService.getPrjProjectProductListPerformanceEcommerceById(this.projectId,this.currentPageProductListPerformanceEcommerce, this.itemsPerPage, searchString)
      .subscribe((res: PaginatedResult<PrjProductListPerformanceEcommerce[]>) => {

          //          console.log(res);
          this.prjProductListPerformanceEcommerce = res.result;// schedules;

          this.totalItemsProductListPerformanceEcommerce = res.pagination.TotalItems;
          this.loadingBarService.complete();
        },
        error => {
          this.loadingBarService.complete();
          this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
        });

  }


  // public loadViewProjectOvervieweCommerces(projectId: string): void {
  //   this.dataService.getPrjProjectOvervieweCommercesById(projectId).subscribe((res: PrjProjectOvervieweCommerces[]) => {
  //       this.prjProjectOvervieweCommerces = res;
  //     },
  //     error => {
  //       this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
  //     });
  //   this.loadingBarService.complete();
  // }




  pageChanged(event: any): void {
    this.currentPage = event.page;
    if (!this.searchString)
      this.loadViewProjectOvervieweCommerces('');
    else
      this.loadViewProjectOvervieweCommerces(this.searchString);

  };

  pageChangedProductListPerformanceEcommerce(event: any): void {
    this.currentPage = event.page;
    if (!this.searchString)
      this.loadViewProductListPerformanceEcommerce('');
    else
      this.loadViewProductListPerformanceEcommerce(this.searchString);

  };



  // ngAfterViewChecked(): void {
  //   this.formChanged();
  // }

  // formChanged() {
  //   if (this.currentForm === this.viewPrjProjectOvervieweCommercesForm) {
  //     return;
  //   }
  //   this.viewPrjProjectOvervieweCommercesForm = this.currentForm;
  //   if (this.viewPrjProjectOvervieweCommercesForm) {
  //     this.viewPrjProjectOvervieweCommercesForm.valueChanges
  //       .subscribe(data => this.onValueChanged(data));
  //   }
  // }
  //
  // onValueChanged(data?: any) {
  //   if (!this.viewPrjProjectOvervieweCommercesForm) {
  //     return;
  //   }
  //   const form = this.viewPrjProjectOvervieweCommercesForm.form;
  //   this.isValid = true;
  //   for (const field in this.formErrors) {
  //
  //     this.formErrors[field] = '';
  //     const control = form.get(field);
  //     if (control && control.dirty && !control.valid) {
  //       // console.log(field);
  //       this.isValid = false;
  //       const messages = this.validationMessages[field];
  //       for (const key in control.errors) {
  //
  //         this.formErrors[field] += messages[key] + ' ';
  //         // console.log(this.formErrors[field]);
  //       }
  //     }
  //   }
  // }

  // addNewPrjProjectOvervieweCommerces(PrjProjectOvervieweCommerces: PrjProjectOvervieweCommerces) {
  //   var _user = this.membershipService.getLoggedInUser();
  //   PrjProjectOvervieweCommerces.MAKER_ID = _user.Username;
  //
  //   //console.log(domain);
  //   this.loadingBarService.start();
  //
  //   this.dataService.createPrjProjectOvervieweCommerces(PrjProjectOvervieweCommerces)
  //     .subscribe(rs => {
  //         if (rs.Succeeded) {
  //           this.notificationService.printSuccessMessage(rs.Message);
  //           this.Categories.push(PrjProjectOvervieweCommerces);
  //           this.addPrjProjectOvervieweCommerces = new PrjProjectOvervieweCommerces();
  //           this.loadCategories('');
  //           this.hideChildModal();
  //         } else {
  //           this.notificationService.printErrorMessage(rs.Message);
  //         }
  //         //this.notificationService.printSuccessMessage('Thêm domain thành công');
  //         this.loadingBarService.complete();
  //
  //
  //       },
  //       error => {
  //         if(error.status == 404)
  //           {
  //             this.utilityService.navigateToSignIn();
  //             this.notificationService.printErrorMessage('Vui lòng đăng nhập tài khoản để xác thực!');
  //           }
  //           else if(error.status == 403 || error.status == 401)
  //             {
  //               this.utilityService.navigateToSignIn();
  //               this.notificationService.printErrorMessage('Bạn không có quyền truy cập vào chức năng này!');
  //             }
  //             else
  //               {this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);}
  //         // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {
  //
  //         //   // this.utilityService.navigateToSignIn();
  //
  //         // }
  //         // this.loadingBarService.complete();
  //         // this.notificationService.printErrorMessage('Lỗi- ' + error);
  //       });
  // }
  //
  //
  // viewAddPrjProjectOvervieweCommerces() {
  //   this.isViewDetail = false;
  //   this.onEdit = false;
  //   this.addPrjProjectOvervieweCommerces = new PrjProjectOvervieweCommerces();
  //   this.selectedPrjProjectOvervieweCommerces = new PrjProjectOvervieweCommerces();
  //   this.addingPrjProjectOvervieweCommerces = true;
  //   this.loadingBarService.complete();
  //   this.selectedPrjProjectOvervieweCommercesLoaded = true;
  //
  //
  //   this.dataService.getCategories(this._page, '').subscribe((res) => {
  //     var data: any = res.json();
  //
  //     this.categoriesParentList = data.Items;
  //   });
  //
  //   this.childModal.show();
  //
  // }
  //
  // deletePrjProjectOvervieweCommerces(PrjProjectOvervieweCommerces: PrjProjectOvervieweCommerces) {
  //   //console.log(domain);
  //   this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
  //     () => {
  //       this.loadingBarService.start();
  //       this.dataService.deletePrjProjectOvervieweCommerces(PrjProjectOvervieweCommerces.PrjProjectOvervieweCommerces_ID)
  //         .subscribe(rs => {
  //             if (rs.Succeeded) {
  //               this.notificationService.printSuccessMessage(rs.Message);
  //               this.itemsService.removeItemFromArray<PrjProjectOvervieweCommerces>(this.Categories, PrjProjectOvervieweCommerces);
  //             } else {
  //               this.notificationService.printErrorMessage(rs.Message);
  //             }
  //
  //             //this.notificationService.printSuccessMessage('Xóa domain thành công');
  //             this.loadingBarService.complete();
  //           },
  //           error => {
  //             if(error.status == 404)
  //               {
  //                 this.utilityService.navigateToSignIn();
  //                 this.notificationService.printErrorMessage('Vui lòng đăng nhập tài khoản để xác thực!');
  //               }
  //               else if(error.status == 403 || error.status == 401)
  //                 {
  //                   this.utilityService.navigateToSignIn();
  //                   this.notificationService.printErrorMessage('Bạn không có quyền truy cập vào chức năng này!');
  //                 }
  //                 else
  //                   {this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);}
  //             // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {
  //
  //             //   this.utilityService.navigateToSignIn();
  //
  //             // }
  //             // this.loadingBarService.complete();
  //             // this.notificationService.printErrorMessage('Lỗi ' + ' ' + error);
  //           });
  //     });
  // }
  //
  // editPrjProjectOvervieweCommerces(PrjProjectOvervieweCommerces: PrjProjectOvervieweCommerces) {
  //   //console.log(domain);
  //
  //   //console.log(this.selectedManageUser);
  //   var _user = this.membershipService.getLoggedInUser();
  //   this.selectedPrjProjectOvervieweCommerces.EDITOR_ID = _user.Username;
  //   this.loadingBarService.start();
  //
  //
  //   this.onEdit = true;
  //   this.dataService.updatePrjProjectOvervieweCommerces(this.selectedPrjProjectOvervieweCommerces)
  //     .subscribe(res => {
  //         if (res.Succeeded) {
  //           this.notificationService.printSuccessMessage(res.Message);
  //           this.hideChildModal();
  //         } else {
  //           this.notificationService.printErrorMessage(res.Message);
  //         }
  //         //this.notificationService.printSuccessMessage('Domain đã được cập nhật');
  //         this.loadingBarService.complete();
  //       },
  //       error => {
  //         if(error.status == 404)
  //           {
  //             this.utilityService.navigateToSignIn();
  //             this.notificationService.printErrorMessage('Vui lòng đăng nhập tài khoản để xác thực!');
  //           }
  //           else if(error.status == 403 || error.status == 401)
  //             {
  //               this.utilityService.navigateToSignIn();
  //               this.notificationService.printErrorMessage('Bạn không có quyền truy cập vào chức năng này!');
  //             }
  //             else
  //               {this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);}
  //         // if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {
  //
  //         //   //this.utilityService.navigateToSignIn();
  //
  //         // }
  //         // this.loadingBarService.complete();
  //         // this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
  //       });
  // }
  //
  //
  // public viewDetail(PrjProjectOvervieweCommerces: PrjProjectOvervieweCommerces) {
  //   this.addingPrjProjectOvervieweCommerces = false;
  //
  //   this.selectedPrjProjectOvervieweCommerces = PrjProjectOvervieweCommerces;
  //
  //
  //   this.loadingBarService.complete();
  //   this.selectedPrjProjectOvervieweCommercesLoaded = true;
  //
  //   this.childModal.show();
  //   this.isViewDetail = true;
  // }
  //
  // public viewPrjProjectOvervieweCommercesDetails(PrjProjectOvervieweCommerces: PrjProjectOvervieweCommerces): void {
  //   this.isViewDetail = false;
  //   this.addingPrjProjectOvervieweCommerces = false;
  //
  //   this.selectedPrjProjectOvervieweCommerces = PrjProjectOvervieweCommerces;
  //
  //
  //   this.dataService.getCategories(this._page, '').subscribe((res) => {
  //     var data: any = res.json();
  //
  //     this.categoriesParentList = data.Items;
  //
  //     var index = this.categoriesParentList.findIndex(n => n.PrjProjectOvervieweCommerces_ID === PrjProjectOvervieweCommerces.PrjProjectOvervieweCommerces_ID);
  //
  //     this.categoriesParentList.splice(index, 1);
  //
  //   });
  //
  //
  //   this.loadingBarService.complete();
  //   this.selectedPrjProjectOvervieweCommercesLoaded = true;
  //
  //   this.childModal.show();
  // }


  public hideChildModal(): void {
    this.childModal.hide();
  //  this.loadCategories('');
  }

  // public selectedParentNode(PrjProjectOvervieweCommercesId: string): void {
  //   this.loadingBarService.start();
  //   if (PrjProjectOvervieweCommercesId) {
  //     this.dataService.getPrjProjectOvervieweCommerces(PrjProjectOvervieweCommercesId).subscribe(res => {
  //       this.selectedPrjProjectOvervieweCommerces.PrjProjectOvervieweCommerces_LEVEL = res.PrjProjectOvervieweCommerces_LEVEL + 1;
  //       this.loadingBarService.complete();
  //     });
  //   } else {
  //     this.selectedPrjProjectOvervieweCommerces.PrjProjectOvervieweCommerces_LEVEL = 1;
  //   }

//  }
}
