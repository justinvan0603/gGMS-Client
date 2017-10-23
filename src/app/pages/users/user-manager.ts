import {ApplicationGroup} from "./applicationGroup";
export class UserManager {
  Id: string;
  UserName: string;
  Email: string;

  PASSWORD: string;

  FULLNAME: string;
  PHONE: number;
  PARENT_ID: number;
  DESCRIPTION: string;
  RECORD_STATUS: string;
  AUTH_STATUS: string;
  CREATE_DT: Date;
  APPROVE_DT: Date;
  EDIT_DT: Date;
  MAKER_ID: string;
  CHECKER_ID: string;
  EDITOR_ID: string;
  APPTOKEN: string;

  // Groups : string;
  Groups: ApplicationGroup[];


  Domain: string;
  DomainDesc: string;

  constructor() {
    this.Id = '';
    this.UserName = '';
    this.Email = '';

    this.FULLNAME = '';
    this.PASSWORD = '';
    this.Email = '';
    this.PHONE = null;
    this.PARENT_ID = null;
    this.DESCRIPTION = '';
    this.RECORD_STATUS = '';
    this.AUTH_STATUS = '';
    this.CREATE_DT = new Date();
    this.APPROVE_DT = new Date();
    this.EDIT_DT = new Date();
    this.MAKER_ID = '';
    this.CHECKER_ID = '';
    this.EDITOR_ID = '';
    this.APPTOKEN = '';

    this.Domain = '';
    this.DomainDesc = '';
    //   this.Groups='';
    this.Groups = new Array<ApplicationGroup>();
  }
}
