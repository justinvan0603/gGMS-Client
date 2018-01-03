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
import { PrjProject } from "./prjproject";
import { DataService } from "./prjproject.service";
import { LookUpProject } from './lookupproject';
import { CmAllCode } from "../cmallcode/cmallcode";
import { CmAllCodeService as AllCodeService } from "../cmallcode/cmallcode.service";
import { PrdProductService as ProductService } from '../prdproducts/prdproducts.service';
import { PrdProduct } from '../prdproducts/prdproducts';
import { DataService as ContractService } from '../contract/contract.service';
import { ContractModel } from '../contract/contract';
import { ContractDetail } from '../contract/contract-dt';

import { PrdProductViewModel } from '../prdproducts/prdproductviewmodel';

import { MyModelGen } from "./mymodelgen";

declare var jQuery: any;

@Component({
  // moduleId: module.id,

  selector: 'prjproject',
  templateUrl: 'prjproject-list.component.html',

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
export class PrjProjectComponent {

  prjProjects: PrjProject[];

  states: CmAllCode[];

  apiHost: string;

  lookUpProject: LookUpProject;

  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public currentPage: number = 1;
  public searchString: string;

  constructor(
    private dataService: DataService,
    private itemsService: ItemsService,
    private allCodeService: AllCodeService,
    private notificationService: NotificationService,
    private contractService: ContractService,
    private productService: ProductService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private loadingBarService: SlimLoadingBarService,
    private membershipService: MembershipService,
    private router: Router
  ) {
    this.searchString = '';
    this.prjProjects = new Array<PrjProject>();
    this.states = new Array<CmAllCode>();
    this.lookUpProject = new LookUpProject();
  }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.dataService.setToken(this.membershipService.getTokenUser());
    this.contractService.setToken(this.membershipService.getTokenUser());
    this.productService.setToken(this.membershipService.getTokenUser());
    this.loadProjects('');
    this.loadStates();
    //console.log(this.dataService._token);
  }

  loadStates() {
    this.allCodeService.getTypeByCode('STATE').subscribe(res => {
      this.states = res;
    },
      error => {
        this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
      });
  }
  search(searchstring: string) {
    if(!searchstring)
      searchstring = '';
    this.currentPage =1;
    this.loadProjects(searchstring);
  }

  loadProjects(searchString?: string) {
    this.loadingBarService.start();

    this.dataService.getProjects(this.currentPage, this.itemsPerPage, searchString)
      .subscribe((res: PaginatedResult<PrjProject[]>) => {

        //          console.log(res);
        this.prjProjects = res.result;// schedules;

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
    if (!this.searchString)
      this.loadProjects('');
    else
      this.loadProjects(this.searchString);

  };


  deleteProject(prjproject: PrjProject) {
    //console.log(domain);
    this.notificationService.openConfirmationDialog('Bạn có chắc muốn xóa?',
      () => {
        this.loadingBarService.start();
        this.dataService.deleteProject(prjproject.PROJECT_ID)
          .subscribe(rs => {
            if (rs.Succeeded) {
              this.notificationService.printSuccessMessage(rs.Message);
              this.itemsService.removeItemFromArray<PrjProject>(this.prjProjects, prjproject);
            }
            else {
              this.notificationService.printErrorMessage(rs.Message);
            }
            this.loadingBarService.complete();
          },
          error => {
            if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

              this.utilityService.navigateToSignIn();

            }
            this.loadingBarService.complete();
            this.notificationService.printErrorMessage('Lỗi ' + ' ' + error);
          });
      });
  }

  lookupProject() {
    this.loadingBarService.start();
    this.dataService.filter(this.lookUpProject).subscribe(res => {
      this.prjProjects = res.result; // schedules;
      this.totalItems = res.pagination.TotalItems;

      this.loadingBarService.complete();
    },
      error => {
        this.loadingBarService.complete();
        this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
      });
  }


  generateSource(prjproject: PrjProject) {
    //console.log(prjproject);
    this.loadingBarService.start();
    if (prjproject.CONTRACT_ID != '') {
      this.contractService.getContractDtByContractId(prjproject.CONTRACT_ID).subscribe(res => {
        var dts: ContractDetail[] = res;
        //console.log(res);
          //console.log(dts);
        for (let dt of dts) {
          this.productService.getProductFullDetail(dt.ProductId).subscribe((res: PrdProductViewModel) => {
            //  console.log(res);
            var product: PrdProduct = res.PrdProduct;
            if (product == null) {
              this.loadingBarService.complete();
              this.notificationService.printErrorMessage("Hợp đồng chưa có sản phẩm!");
            } else {
              this.notificationService.printSuccessMessage("Bắt đầu khởi tạo Website. Có thể sẽ mất vài phút...");
              this.generateSourceFromProduct(product, prjproject);
            }

          },
            error => {
              this.loadingBarService.complete();
              this.notificationService.printErrorMessage(error);
            });
        }
      },
        error => {
          if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404)
            this.utilityService.navigateToSignIn();
          this.loadingBarService.complete();
          this.notificationService.printErrorMessage(error);
        });
    } else {
      this.notificationService.printErrorMessage("Dự án này không có hợp đồng!");
    }
  }
  generateSourceFromProduct(product: PrdProduct, prjproject : PrjProject) {
    var modelGen: MyModelGen = new MyModelGen();
    modelGen.DatabaseName = prjproject.DATABASE_NAME;
    modelGen.DatabaseUser = prjproject.MYSQL_USERNAME;
    modelGen.Password = prjproject.MYSQL_PASSWORD;
    modelGen.Source = product.ProductLocation;
    modelGen.Destination = prjproject.SUB_DOMAIN;
    modelGen.ScriptLocation = product.Scripts;
    modelGen.Domain = prjproject.DOMAIN;
    modelGen.Subdomain = prjproject.SUB_DOMAIN;
    var mysqlString = '';
    this.allCodeService.getTypeByCode("MYSQL_CONN").subscribe(res => {
        if (res == null) {
          this.notificationService.printErrorMessage("Không tìm thấy connection string mysql");
        } else {
          mysqlString = res[0].Content;
          modelGen.MySqlConnectionString = mysqlString;
          this.allCodeService.getTypeByCode("DESTINATION").subscribe(res => {
              if (res == null) {
                this.notificationService.printErrorMessage("Không tìm thấy destination");
              } else {
                modelGen.Destination = res[0].Content + modelGen.Destination;
                //console.log(modelGen);
                this.dataService.generateSource(modelGen).subscribe(res => {
                 // console.log(res);
               //  console.log(res.isSucceeded);
                 //console.log(res.errorMessage);
                  if(res.isSucceeded == true)
                    {
                      this.notificationService.printSuccessMessage(res.errorMessage);
                    }
                    else
                      {
                        this.notificationService.printErrorMessage(res.errorMessage);
                      }
                 //this.notificationService.printSuccessMessage(res.Message);
                 //this.notificationService.printSuccessMessage(res.MessageSql);
                },
                  error => {
                    if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404)
                      this.utilityService.navigateToSignIn();
                      if(error.status === 502)
                      this.notificationService.printSuccessMessage("Website đang được khởi tạo. Vui lòng chờ!");
                  });
              }
            },
            error => {
              if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404)
                this.utilityService.navigateToSignIn();
            }
          );
        }
      },
      error => {
        if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404)
          this.utilityService.navigateToSignIn();
      }
    );
   

    
  }
}