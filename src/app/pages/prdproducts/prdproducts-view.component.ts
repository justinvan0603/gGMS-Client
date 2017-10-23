import {
    Component, OnInit, ViewChild, Input, Output,
    trigger,
    state,
    style,
    animate,
    transition, AfterViewChecked, ViewEncapsulation
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
import { ActivatedRoute } from '@angular/router';


import { CmAllCode } from "../cmallcode/cmallcode";
import { CmAllCodeService } from "../cmallcode/cmallcode.service";

import { Paginated } from "../messages/paginated";
import { PrdProduct } from "./prdproducts";
import { PrdProductService } from "./prdproducts.service";
import { PrdTemplate } from "../prdtemplates/prdtemplates";
import { PrdPlugin } from "../prdplugins/prdplugins";
import { SourceModel } from "../source/source";
import { PrdProductViewModel } from "./prdproductviewmodel";
import { SourceService } from "../source/source.service";
import { TemplateService } from "../prdtemplates/prdtemplates.service";
import { PluginService } from "../prdplugins/prdplugins.service";
import { TreeModule,TreeNode,IActionMapping,KEYS,TREE_ACTIONS } from 'angular-tree-component';
const actionMapping:IActionMapping = {
  mouse: {
    click: TREE_ACTIONS.TOGGLE_SELECTED_MULTI
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
  }
};

// import '../../../../node_modules/font-awesome/css/font-awesome.min.css';
// import '../../../../node_modules/primeng/resources/primeng.min.css';
// import '../../../../node_modules/primeng/resources/themes/omega/theme.css';
@Component({
    // moduleId: module.id,

    selector: 'prdproducts',
    templateUrl: 'prdproducts-view.component.html',

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
//     encapsulation: ViewEncapsulation.None,
//     styleUrls: [
//     '../../../../node_modules/font-awesome/css/font-awesome.min.css',
//     '../../../../node_modules/primeng/resources/primeng.min.css',
//     '../../../../node_modules/primeng/resources/themes/omega/theme.css'
//   ],
})
export class ProductViewComponent   {
    viewProductForm : NgForm;
    @ViewChild('viewProductForm') currentForm: NgForm;

    //viewTemplateForm : NgForm;
    //@ViewChild('viewTemplateForm') currentForm: NgForm;
    //@ViewChild('childModal') public childModal: ModalDirective;
    public totalPrice: number = 0;
    public prdProductViewModel: PrdProductViewModel;
    public productId: string;
   // public listTemplates: PrdTemplate[];
    //public listPlugins: PrdPlugin[];
    //public listSources: SourceModel[];
    apiHost: string;

    public listProductType: CmAllCode[];
    public selectedProductType: CmAllCode;
    // Modal properties
   
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    formErrors = {
    'ProductCode': '',
    'ProductName' : '',
    'ProductLocation' : '',
    'Notes':''
 
  };
  public isValid: boolean = true;
  validationMessages = {
    'ProductCode': {
      'required':      'Mã sản phẩm không được để trống', 
      'maxlength':     'Mã sản phẩm phải từ 1-15 ký tự',
    },
    'ProductName': {
      'required':      'Tên sản phẩm không được để trống', 
      'maxlength':     'Tên sản phẩm phải từ 1-256 ký tự',
    },
    'ProductLocation': {
      'required':      'Vị trí lưu không được để trống', 
      'maxlength':     'Vị trí lưu phải từ 1-1000 ký tự',
    }
    ,
    'Notes': {
      'maxlength':      'Mô tả phải từ 1-500 ký tự', 
      
    }
  };
  public options = { actionMapping }
  //public listSelectedCategory: TreeNode[];

    constructor(
      private cmAllCodeService: CmAllCodeService,
        private templateService: TemplateService,
        private pluginService: PluginService,
        private sourceService: SourceService,
        private dataService: PrdProductService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        private route: ActivatedRoute,
 
        private membershipService:MembershipService
        ) { 
            
            // this.listTemplates = new Array<PrdTemplate>();
            // this.listPlugins = new Array<PrdPlugin>();
            // this.listSources = new Array<SourceModel>();
            this.prdProductViewModel = new PrdProductViewModel();
        }

    ngOnInit() {
        //this.dataService.set( 12);
        this.dataService.setToken(this.membershipService.getTokenUser()); 
        this.templateService.setToken(this.membershipService.getTokenUser());
        this.sourceService.setToken(this.membershipService.getTokenUser());
        this.cmAllCodeService.setToken(this.membershipService.getTokenUser());
        this.pluginService.setToken(this.membershipService.getTokenUser());
        
        this.route.params.subscribe(params => {this.productId=params['productid']});
        this.apiHost = this.configService.getApiHost();
         
         this.dataService.getProductFullDetail(this.productId).subscribe(
            res =>{
              this.prdProductViewModel = res;
              this.set0();
                this.loadListProductType('PRODUCT_TYPE');
                //this.listSelectedCategory = res.ListCategory;
                //this.prdProductViewModel.ListCategory = this.prdProductViewModel.ListCategory.map(item => new TreeNode(item));
                //this.listSelectedCategory = res.ListSelectedCategory.map(item => <TreeNode>item);
               // console.log(this.listSelectedCategory);
                this.calculateTotalPrice();
            },
            error =>{
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
              //    this.loadingBarService.complete();
              //  this.notificationService.printErrorMessage('Có lỗi khi tải .- ' + error);
            }
         );
    }

  set0(): void {
    if (this.prdProductViewModel.PrdProduct.Price == null) {
      this.prdProductViewModel.PrdProduct.Price = 0;
    }
    if (this.prdProductViewModel.PrdProduct.Vat == null) {
      this.prdProductViewModel.PrdProduct.Vat = 0;
    }
    if (this.prdProductViewModel.PrdProduct.PriceVat == null) {
      this.prdProductViewModel.PrdProduct.PriceVat = 0;
    }
    if (this.prdProductViewModel.PrdProduct.DiscountAmt == null) {
      this.prdProductViewModel.PrdProduct.DiscountAmt = 0;
    }
  }

  loadListProductType(cmcode: string)
        {
            this.cmAllCodeService.getTypeByCode(cmcode).subscribe(
                res => {
                    this.listProductType = res;
                    this.selectedProductType = this.listProductType.find(type => type.Cdval === this.prdProductViewModel.PrdProduct.ProductType);
                },
                error => {
                    this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
                }

            );
        } 
    calculateTotalPrice()
    {
        for(let item of this.prdProductViewModel.ListSources)
        {
            if(item.PriceVat != null && item.RecordStatus=== '1')
                this.totalPrice += item.Price;
        }
        for(let item of this.prdProductViewModel.ListTemplates)
        {
            if(item.PriceVat != null && item.RecordStatus=== '1')
                this.totalPrice += item.Price;
        }
        for(let item of this.prdProductViewModel.ListPlugins)
        {
            if(item.PriceVat != null && item.RecordStatus=== '1')
                this.totalPrice += item.Price;
        }
        
        
    }
public check(node, $event) {
  this.updateChildNodesCheckBox(node, $event.target.checked);
  this.updateParentNodesCheckBox(node.parent);
  //console.log(node.data);
  node.data.data.RECORD_STATUS = $event.target.checked == true? '1':'0';
//   if(node.data.children != null)
//   {
//     if(node.data.children.length >0)
//     {
//         for(let item of node.data.children)
//         {
//             item.data.RECORD_STATUS = $event.target.checked == true? '1':'0';
//         }
//     }
//   }
   //console.log(this.prdProductViewModel.ListCategory);
}
public updateChildNodesCheckBox(node, checked) {
  node.data.checked = checked;
  node.data.data.RECORD_STATUS = checked == true? '1':'0';
  if (node.children) {
    node.children.forEach((child) => this.updateChildNodesCheckBox(child, checked));
  }
}
public updateParentNodesCheckBox(node) {
  if (node && node.level > 0 && node.children) {
    let allChildChecked = true;
    let noChildChecked = true;

    for (let child of node.children) {
      if (!child.data.checked) {
        allChildChecked = false;
      } else if (child.data.checked) {
        noChildChecked = false;
      }
    }

    if (allChildChecked) {
      node.data.checked = true;
      node.data.indeterminate = false;
      node.data.data.RECORD_STATUS = '1';
    } else if (noChildChecked) {
      node.data.checked = false;
      node.data.indeterminate = false;
      node.data.data.RECORD_STATUS = '0';
    } else {
      node.data.checked = true;
      node.data.indeterminate = true;
      node.data.data.RECORD_STATUS = '1';
    }
    this.updateParentNodesCheckBox(node.parent);
  }
}

}