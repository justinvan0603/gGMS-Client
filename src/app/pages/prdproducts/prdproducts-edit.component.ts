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
import { ActivatedRoute } from '@angular/router';
// import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ItemsService } from '../shared/utils/items.service';
import { ConfigService } from '../shared/utils/config.service';
import { Pagination, PaginatedResult } from '../shared/interfaces';
import { NotificationService } from "../shared/utils/notification.service";
// import { Domain } from "./domain";
import { NgaModule } from '../../theme/nga.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ManageUser } from "./manageuser";
// import { ManageUserService } from "./manageuser.service";
import { NgForm } from "@angular/forms";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";
import { BrowserModule } from "@angular/platform-browser";

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

@Component({
    // moduleId: module.id,

    selector: 'prdproducts',
    templateUrl: 'prdproducts-edit.component.html',

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
export class ProductEditComponent implements AfterViewChecked    {
    viewProductForm : NgForm;
    @ViewChild('viewProductForm') currentForm: NgForm;
    @ViewChild('pluginModal') public pluginModal: ModalDirective;
    @ViewChild('sourceModal') public sourceModal: ModalDirective;
    @ViewChild('templateModal') public templateModal: ModalDirective;
    public Plugins: PrdPlugin[];
    public Sources:SourceModel[];
    public Templates: PrdTemplate[];
    public searchString:string;
    //viewTemplateForm : NgForm;
    //@ViewChild('viewTemplateForm') currentForm: NgForm;
    //@ViewChild('childModal') public childModal: ModalDirective;
    public prdProductViewModel: PrdProductViewModel;
    public totalPrice: number = 0;
   // public listTemplates: PrdTemplate[];
    //public listPlugins: PrdPlugin[];
    //public listSources: SourceModel[];
    apiHost: string;

    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;

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
  public productId: string;
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
      
    },
    'Price': {
      'required': 'Trường giá là bắt buộc',
      'maxlength': 'Giá không được nhập quá 18 số',
      'pattern': 'Giá không hợp lệ '
    },
    'PriceVat': {
      'required': 'Trường giá bao gồm VAT là bắt buộc',
      'maxlength': 'Giá bao gồm VAT không được nhập quá 18 số',
      'pattern': 'Giá VAT không hợp lệ '
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
       
        public router: Router,
        private membershipService:MembershipService
        ) { 
            
            // this.listTemplates = new Array<PrdTemplate>();
            // this.listPlugins = new Array<PrdPlugin>();
            // this.listSources = new Array<SourceModel>();
            this.prdProductViewModel = new PrdProductViewModel();
        }

    ngOnInit() {
        this.route.params.subscribe(params => {this.productId=params['productid']});
       // this.dataService.set( 12);
        this.apiHost = this.configService.getApiHost();
         this.dataService.setToken(this.membershipService.getTokenUser());
          this.selectedProductType = new CmAllCode();
         this.loadProduct(this.productId);

         
         
         
    }
    loadListProductType(cmcode: string)
        {
            this.cmAllCodeService.getTypeByCode(cmcode).subscribe(
                res => {
                    this.listProductType = res;
                    this.selectedProductType = this.listProductType.find(type => type.Cdval === this.prdProductViewModel.PrdProduct.ProductType);
                    //console.log(this.selectedProductType);
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
                //     this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
                }

            );
        }
    calculateTotalPrice() {
        this.prdProductViewModel.PrdProduct.Price = 0;
        for(let item of this.prdProductViewModel.ListSources)
        {
            if(item.PriceVat != null && item.RecordStatus=== '1')
                this.prdProductViewModel.PrdProduct.Price += item.Price + item.PriceVat - item.DiscountAmt;
        }
        for(let item of this.prdProductViewModel.ListTemplates)
        {
            if(item.PriceVat != null && item.RecordStatus=== '1')
                this.prdProductViewModel.PrdProduct.Price += item.Price + item.PriceVat - item.DiscountAmt;
        }
        for(let item of this.prdProductViewModel.ListPlugins)
        {
            if(item.PriceVat != null && item.RecordStatus=== '1')
                this.prdProductViewModel.PrdProduct.Price += item.Price + item.PriceVat - item.DiscountAmt;
        }
        this.changePrice();
    }
    loadProduct(productid: string)
    {
        this.loadingBarService.start();
        
        this.dataService.getProductFullDetail(productid).subscribe(
            res =>{
              this.prdProductViewModel = res;
              this.set0();
                //this.calculateTotalPrice();
                this.loadListProductType('PRODUCT_TYPE');
            },
            error=>{
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
            }
        );
    }

    set0(): void {
      
    if (this.prdProductViewModel.PrdProduct.Price == null) {
      this.prdProductViewModel.PrdProduct.Price = 0;
    }if (this.prdProductViewModel.PrdProduct.Vat == null) {
      this.prdProductViewModel.PrdProduct.Vat = 0;
    }if (this.prdProductViewModel.PrdProduct.PriceVat == null) {
      this.prdProductViewModel.PrdProduct.PriceVat = 0;
    }if (this.prdProductViewModel.PrdProduct.DiscountAmt == null) {
      this.prdProductViewModel.PrdProduct.DiscountAmt = 0;
    }

  }
onlistSourceChecked(selectedSource: SourceModel,$event)
    {
        selectedSource.RecordStatus = $event.target.checked == true ? '1':'0';
        if(selectedSource.RecordStatus == '1')
        {
            if(selectedSource.PriceVat != null)
            {
            this.prdProductViewModel.PrdProduct.Price += selectedSource.PriceVat;
            }
        }
        else
        {
           if(selectedSource.PriceVat != null)
            {
            this.prdProductViewModel.PrdProduct.Price -= selectedSource.PriceVat;
            }
        }
        //console.log(this.prdProductViewModel.ListSources[0]);
        //alert("Caught!");
  this.calculateTotalPrice();
    }
    onlistPluginChecked(selectedPlugin: PrdPlugin,$event)
    {
        selectedPlugin.RecordStatus = $event.target.checked == true ? '1':'0';
        if(selectedPlugin.RecordStatus == '1')
        {
            if(selectedPlugin.PriceVat != null)
            {
            this.prdProductViewModel.PrdProduct.Price += selectedPlugin.PriceVat;
            }
        }
        else
        {
           if(selectedPlugin.PriceVat != null)
            {
            this.prdProductViewModel.PrdProduct.Price -= selectedPlugin.PriceVat;
            }
        }
       // console.log(this.prdProductViewModel.ListSources);
        //alert("Caught!");
      this.calculateTotalPrice();
    }
    onlistTemplateChecked(selectedTemplate: PrdTemplate,$event)
    {
        selectedTemplate.RecordStatus = $event.target.checked == true ? '1':'0';
        if(selectedTemplate.RecordStatus == '1')
        {
            if(selectedTemplate.PriceVat != null)
            {
            this.prdProductViewModel.PrdProduct.Price += selectedTemplate.PriceVat;
            }
        }
        else
        {
           if(selectedTemplate.PriceVat != null)
            {
            this.prdProductViewModel.PrdProduct.Price -= selectedTemplate.PriceVat;
            }
        }
        //console.log(this.prdProductViewModel.ListSources);
        //alert("Caught!");
      this.calculateTotalPrice();
    }


ngAfterViewChecked(): void {
            this.formChanged();
    }
    formChanged()
    {
         if (this.currentForm === this.viewProductForm) { return; }
         this.viewProductForm = this.currentForm;
         if(this.viewProductForm)
         {
            this.viewProductForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
         }
    }
    onValueChanged(data?: any)
    {
        if (!this.viewProductForm) { return; }
        const form = this.viewProductForm.form;
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
    updateProduct()
    {
        // if(this.prdProductViewModel.ListPlugins.length >0)
        // {
        //     if(this.prdProductViewModel.ListPlugins.filter(plg => plg.RecordStatus === '1').length == 0)
        //     {
        //         this.notificationService.printErrorMessage("Phải chọn ít nhất một plugin!");
        //         return;
        //     }
        // }
        // if(this.prdProductViewModel.ListSources.length > 0)
        // {
        //     if(this.prdProductViewModel.ListSources.filter(src => src.RecordStatus ==='1').length == 0)
        //     {
        //         this.notificationService.printErrorMessage("Phải chọn ít nhất một source!");
        //         return;
        //     }
        // }
        // if(this.prdProductViewModel.ListTemplates.length >0)
        // {
        //     if(this.prdProductViewModel.ListTemplates.filter(temp => temp.RecordStatus ==='1').length == 0)
        //     {
        //     this.notificationService.printErrorMessage("Phải chọn ít nhất một template!");
        //     return;
        //     }
        // }
        this.prdProductViewModel.PrdProduct.ProductType = this.selectedProductType.Cdval;
        //console.log(this.prdProductViewModel);
        this.dataService.updateProduct(this.prdProductViewModel).subscribe(
            rs=>{
                if(rs.Succeeded)
                {
                    this.notificationService.printSuccessMessage(rs.Message);
                     this.router.navigate(['pages/prdproduct/productslist']);
                }
                else
                {
                    this.notificationService.printErrorMessage(rs.Message);
                }
                //this.notificationService.printSuccessMessage('Thêm domain thành công');
                this.loadingBarService.complete();
            },
            error=>{
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
            }
        );
    }
    public hidePluginModal(): void {
        this.pluginModal.hide();
    }
    public viewPluginModal()
    {
        this.searchString = '';            
        this.loadListPluginModal('');
        this.loadingBarService.complete();       
        this.pluginModal.show();

    }
    public deletePlugin(selectedPlugin:PrdPlugin)
    {
        this.itemsService.removeItemFromArray<PrdPlugin>(this.prdProductViewModel.ListPlugins, selectedPlugin);
        this.prdProductViewModel.PrdProduct.Price -= selectedPlugin.Price + selectedPlugin.PriceVat - selectedPlugin.DiscountAmt;
      this.calculateTotalPrice();
    }
    searchPluginModal(searchstring: string)
    {
       // console.log(searchstring);
        if(!searchstring)
            searchstring = '';
        this.loadListPluginModal(searchstring);
    }

    public hideSourceModal(): void {
        this.sourceModal.hide();
    }
    public viewSourceModal()
    {
        this.searchString = '';            
        this.loadListSourceModal('');
        this.loadingBarService.complete();       
        this.sourceModal.show();

    }
    public deleteSource(selectedSource:SourceModel)
    {
        this.itemsService.removeItemFromArray<SourceModel>(this.prdProductViewModel.ListSources, selectedSource);
        this.prdProductViewModel.PrdProduct.Price -= selectedSource.Price + selectedSource.PriceVat - selectedSource.DiscountAmt;
      this.calculateTotalPrice();
    }
    searchSourceModal(searchstring:string)
    {
        if(!searchstring)
            searchstring = '';
        this.loadListSourceModal(searchstring);
    }

    



    public hideTemplateModal(): void {
        this.templateModal.hide();
    }
    public viewTemplateModal()
    {
        this.searchString = '';            
        this.loadListTemplateModal('');
        this.loadingBarService.complete();       
        this.templateModal.show();

    }
    public deleteTemplate(selectedTemplate:PrdTemplate)
    {
        this.itemsService.removeItemFromArray<PrdTemplate>(this.prdProductViewModel.ListTemplates, selectedTemplate);
        this.prdProductViewModel.PrdProduct.Price -= selectedTemplate.Price + selectedTemplate.PriceVat - selectedTemplate.DiscountAmt;
      this.calculateTotalPrice();
    }
    searchTemplateModal(searchstring:string)
    {
        if(!searchstring)
            searchstring = '';
        this.loadListTemplateModal(searchstring);
    }
    loadListPluginModal(searchstring?:string)
    {
        this.pluginService.getAllPlugins(searchstring).subscribe(
            res=>{
                this.Plugins = res;
                for(let item of this.Plugins)
                {
                    item.RecordStatus = '0';
                }
            },
            error=>{
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
            }
        );
    }

    onListSourceModalChecked (selectedSource: SourceModel, $event)
    {
        for(let item of this.Sources)
        {
            if(item.RecordStatus == '1')
            {
                item.RecordStatus = '0';
                this.prdProductViewModel.PrdProduct.Price -= item.Price + item.PriceVat - item.DiscountAmt;
            }
        }
        selectedSource.RecordStatus = $event.target.checked == true ? '1' : '0';
      this.calculateTotalPrice();
    }
    onListTemplateModalChecked(selectedTemplate: PrdTemplate,$event)
    {
        selectedTemplate.RecordStatus = $event.target.checked == true ? '1':'0';
    }

    onListPluginModalChecked(selectedPlugin: PrdPlugin,$event)
    {
        selectedPlugin.RecordStatus = $event.target.checked == true ? '1':'0';
       
    }

    // onListModalChecked(selectedPlugin: PrdPlugin,$event)
    // {
    //     selectedPlugin.RecordStatus = $event.target.checked == true ? '1':'0';
       
    //    // console.log(this.prdProductViewModel.ListSources);
    //     //alert("Caught!");
    // }
    loadListSourceModal(searchstring?:string)
    {
        this.sourceService.getAllSources(searchstring).subscribe(
            res=>{
                this.Sources = res;
                for(let item of this.Sources)
                {
                    item.RecordStatus = '0';
                }
            },
            error=>{
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
            }
        );
    }
    loadListTemplateModal(searchstring?:string)
    {
        this.templateService.getAllTemplates(searchstring).subscribe(
                res=>{
                    this.Templates = res;
                    for(let item of this.Templates)
                {
                    item.RecordStatus = '0';
                }
                },
                error=>{
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
                //     this.loadingBarService.complete();
                // this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
                }
        );
    }    



    addPlugin()
    {
        for(let item of this.Plugins)
        {
            if(this.prdProductViewModel.ListPlugins.filter(plg => plg.PluginId === item.PluginId).length == 0)
            {
                if(item.RecordStatus ==='1')
                {
                    this.prdProductViewModel.ListPlugins.push(item);
                    this.prdProductViewModel.PrdProduct.Price+= item.Price + item.PriceVat - item.DiscountAmt;
                }
            }
        }
        this.hidePluginModal();
		this.calculateTotalPrice();
    }
    addSource()
    {
        for(let item of this.Sources)
        {
            if(this.prdProductViewModel.ListSources.filter(src => src.SourceId === item.SourceId).length == 0)
            {
                if(item.RecordStatus ==='1')
                {
                    this.prdProductViewModel.ListSources.push(item);
                    this.prdProductViewModel.PrdProduct.Price+= item.Price + item.PriceVat - item.DiscountAmt;
                }
            }
        }
        this.hideSourceModal();
		this.calculateTotalPrice();
    }
    addTemplate()
    {
        for(let item of this.Templates)
        {
            if(this.prdProductViewModel.ListTemplates.filter(temp => temp.TemplateId === item.TemplateId).length == 0)
            {
                if(item.RecordStatus ==='1')
                {
                    this.prdProductViewModel.ListTemplates.push(item);
                    this.prdProductViewModel.PrdProduct.Price+= item.Price + item.PriceVat - item.DiscountAmt;
                }
            }
        }
        this.hideTemplateModal();
      this.calculateTotalPrice();
    }
    
//Xu ly TreeView
    public check(node, $event) {
  this.updateChildNodesCheckBox(node, $event.target.checked);
  this.updateParentNodesCheckBox(node.parent);
  //console.log(node.data);
 // console.log(node.data);
  node.data.data.RECORD_STATUS = $event.target.checked == true? '1':'0';
  if(this.prdProductViewModel.ListSelectedCategory.find(a => a.data.CATEGORY_ID === node.data.data.CATEGORY_ID))
  {
    this.prdProductViewModel.ListSelectedCategory.find(a => a.data.CATEGORY_ID === node.data.data.CATEGORY_ID).data.RECORD_STATUS =node.data.data.RECORD_STATUS;
  }
  else
  {
    this.prdProductViewModel.ListSelectedCategory.push(node.data);
  }
    //console.log(this.prdProductViewModel.ListSelectedCategory);
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
  if(this.prdProductViewModel.ListSelectedCategory.find(a => a.data.CATEGORY_ID === node.data.data.CATEGORY_ID))
  {
    this.prdProductViewModel.ListSelectedCategory.find(a => a.data.CATEGORY_ID === node.data.data.CATEGORY_ID).data.RECORD_STATUS =node.data.data.RECORD_STATUS;
  }
  else
  {
    this.prdProductViewModel.ListSelectedCategory.push(node.data);
  }

  if (node.children) {
    node.children.forEach((child) => this.updateChildNodesCheckBox(child, checked));
  }
  //console.log(this.prdProductViewModel.ListSelectedCategory);
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
if(this.prdProductViewModel.ListSelectedCategory.find(a => a.data.CATEGORY_ID === node.data.data.CATEGORY_ID))
  {
    this.prdProductViewModel.ListSelectedCategory.find(a => a.data.CATEGORY_ID === node.data.data.CATEGORY_ID).data.RECORD_STATUS =node.data.data.RECORD_STATUS;
  }
  else
  {
    this.prdProductViewModel.ListSelectedCategory.push(node.data);
  }
  //console.log(this.prdProductViewModel.ListSelectedCategory);
    this.updateParentNodesCheckBox(node.parent);
  }
  
}

changePrice(): void {
    this.prdProductViewModel.PrdProduct.PriceVat = this.prdProductViewModel.PrdProduct.Price *
      this.prdProductViewModel.PrdProduct.Vat /
      100;
}

}