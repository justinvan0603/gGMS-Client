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

// import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ActivatedRoute } from '@angular/router';

//import { Optionlink } from "./optionlink";
//import { OptionLinkService } from "./optionlinks.service";
import { ItemsService } from "../shared/utils/items.service";
import { NotificationService } from "../shared/utils/notification.service";
import { ConfigService } from "../shared/utils/config.service";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";
import { PrjInstalledPluginViewModel } from './prjinstalledpluginviewmodel';
import { PrjInstalledPluginService } from './prjinstalledplugin.service';
import { PluginService } from '../prdplugins/prdplugins.service';
import { PrdPlugin } from '../prdplugins/prdplugins';
import { error } from 'util';
import { PrjInstalledPlugin } from './prjinstalledplugin';
import { PluginDistributionService } from './plugindistribution.service';



@Component({
    // moduleId: module.id,

    selector: 'prjinstalledplugins',
    templateUrl: 'prjinstalledplugin-list.component.html',
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
export class PrjInstalledPluginListComponent  {
    //@ViewChild('childModal') public childModal: ModalDirective;
    //searchString: string;
    isCheckAll:boolean;
    editeduser : string;
    ListInstalledPlugin: PrjInstalledPluginViewModel[];
    ListInstalledPluginBeforeSearch:PrjInstalledPluginViewModel[];
    listPlugins: PrdPlugin[];
    selectedPlugin: PrdPlugin;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;

    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;


    constructor(
        private dataService: PrjInstalledPluginService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
        private route: ActivatedRoute,

        private membershipService:MembershipService,
        private prdPluginService: PluginService,
        private pluginDistributionService : PluginDistributionService

        ) {}

    ngOnInit() {

        this.route.params.subscribe(params => {this.editeduser=params['editeduser']});
        this.dataService.setToken(this.membershipService.getTokenUser());
      //  this.loadInstalledPlugin();
        this.isCheckAll = false;
        this.loadListPlugins();
        
    }
    // search(searchString:string)
    // {
    //     if(searchString != '')
    //     {
    //         this.ListDomainUser = this.ListDomainUserBeforeSearch.filter(item => {
    //             for(let key in item)
    //             {
    //                 if((""+item[key]).includes(searchString))
    //                 {
    //                     return true;
    //                 }
    //             }
    //             return false;
    //         });
    //     }
    // }
    loadListPlugins()
    {
        this.prdPluginService.getAllPlugins('').subscribe(
            res => {
                this.listPlugins = res;
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
            }
        );
    }
    loadInstalledPlugin()
    {
        
        this.dataService.getInstalledPlugins(this.selectedPlugin.PluginId).subscribe((data: PrjInstalledPluginViewModel[])=>{
            this.ListInstalledPlugin = data;
            this.ListInstalledPluginBeforeSearch = data;
            
           // console.log(this.ListInstalledPlugin);
            //console.log(this.ListDomainUser.length);
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
                }
        );
    }
    checkAllEvent($event)
    {
        
        this.isCheckAll = $event.target.checked;
        if(this.isCheckAll)
        {
            for(let i =0; i< this.ListInstalledPlugin.length; i++)
            {
                this.ListInstalledPlugin[i].IsChecked = true;
            }
        }
        else
        {
            for(let i =0; i< this.ListInstalledPlugin.length; i++)
            {
                this.ListInstalledPlugin[i].IsChecked = false;
            }
        }
    }

    insertInstalledPlugin()
    {
        this.dataService.insertInstalledPlugins(this.ListInstalledPlugin).subscribe(rs=>{
                if(rs.Succeeded)
                {
                    this.notificationService.printSuccessMessage(rs.Message);
                    this.pluginDistributionService.distributePlugin(this.ListInstalledPlugin).subscribe(
                        res => 
                        {
                            console.log(res);
                            if(res.isSucceeded === true)
                            {
                                this.notificationService.printSuccessMessage(res.errorMessage);
                            }
                            else
                            {
                                this.notificationService.printSuccessMessage(res.errorMessage);
                            }
                        },
                        error => {
                            this.notificationService.printErrorMessage("Có lỗi xảy ra vui lòng thử lại sau!");
                        }
                    );
                }
                else
                {
                    this.notificationService.printErrorMessage("Có lỗi xảy ra vui lòng thử lại sau!");
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
                }
        );
    }





}