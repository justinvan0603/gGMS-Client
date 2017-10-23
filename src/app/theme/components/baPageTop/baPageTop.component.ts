import {Component} from '@angular/core';

import {GlobalState} from '../../../global.state';

import 'style-loader!./baPageTop.scss';
import {MembershipService} from "../../../pages/login/membership.service";
import { Location } from '@angular/common';
import { Router } from "@angular/router";
@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  public username: string;
  constructor(private _state:GlobalState, public membershipService: MembershipService,
              public location: Location,public router: Router) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
      this.username = this.membershipService.getLoggedInUser().Username;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }


  isUserLoggedIn(): boolean {
    return this.membershipService.isUserAuthenticated();
  }

  getUserName(): string {
    if (this.isUserLoggedIn()) {
      var _user = this.membershipService.getLoggedInUser();

      return _user.Username;
    }
    else
      return 'Account';
  }

  logout(): void {

    this.membershipService.logout()
      .subscribe(res => {
          //alert("Remove localstorage");
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          this.router.navigate(['/login']);
        },
        error => console.error('Error: ' + error),
        () => { });
  }
}
