export class MenuRole {
  MenuId : number;
  MenuName : string;
  MenuNameEl: string;
  MenuParent: number;
  MenuLink: string;
  RoleName:string;
  Icon:string

  constructor() {
    this.MenuId = 1;
    this.MenuName='';
    this.MenuNameEl='';
    this.MenuParent=null;
    this.MenuLink ='';
    this.RoleName=null;
    this.Icon = '';

  }
}
