import { Component, HostListener } from '@angular/core';
import { Routes } from '@angular/router';
import { BaMenuService } from '../theme';
import {PageMenuService} from "./pages.menu.service";
import {MembershipService} from "./login/membership.service";
import { PAGES_MENU } from "./pages.menu";
import {UtilityService} from "./shared/services/utility.service";
import {NotificationService} from "./shared/utils/notification.service";


@Component({
//  moduleId: module.id,
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">

      <div class="al-footer-main clearfix">
        <div class="al-copy">&copy; <a href="http://akveo.com"></a>Trang quản trị hệ thống xây dựng Website gGMS</div>

      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
    // <ul class="al-share clearfix">
    //       <li><i class="socicon socicon-facebook"></i></li>
    //       <li><i class="socicon socicon-twitter"></i></li>
    //       <li><i class="socicon socicon-google"></i></li>
    //       <li><i class="socicon socicon-github"></i></li>
    //     </ul>
    //<div class="al-footer-right">Created with <i class="ion-heart"></i></div>
})


export class Pages {

 private PAGES_MENU2: any;
  constructor(private _menuService: BaMenuService, private dataService: PageMenuService, private membershipService:MembershipService,public utilityService: UtilityService, private notificationService: NotificationService) {
    dataService.setToken(this.membershipService.getTokenUser());

    this.loadMessages();
    // window.onbeforeunload = function(e)
    // {
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('access_token');
    // };
    // window.onunload = function(e)
    // {
    //       localStorage.removeItem('user');
    //       localStorage.removeItem('access_token');
    // };
  }
  ngOnInit() {

 //   this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }


  loadMessages() {
   // console.log(this.PAGES_MENU2);
    //var _userData = JSON.parse(localStorage.getItem('user'));



    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);



    this.dataService.getMenu()
      .subscribe(res => {
       //   console.log("res"+res.json());
          var data: any = res.json();
          this.PAGES_MENU2 =data;

          // console.log("menu"+this.PAGES_MENU);
          this._menuService.updateMenuByRoutes(<Routes>this.PAGES_MENU2);
        },
        error => {
        //  if((<String>error.url).includes('Login?ReturnUrl'))
        //  {
        //    console.log("Bat duoc loi khong dang nhap");
        //  }
          if (error.status == 401 || error.status == 302 ||error.status==0 || error.status ==404) {
          //  this.utilityService.navigateToSignIn();
        }

          this.notificationService.printErrorMessage('Không tải được danh sách menu ' + error);


        });


  }
  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHander(event) {
  //   localStorage.removeItem('user');
  //       localStorage.removeItem('access_token');
  // }
  //  @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event) {
  //   localStorage.removeItem('user');
  //       localStorage.removeItem('access_token');
  // }



}
