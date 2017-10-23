export class User {
  Id: string;
  UserName: string;
  FULLNAME: string;
  Password: string;
  Email: string;
  PHONE: number;
  ParentId: number;
  Description: string;
  RecordStatus: string;
  AuthStatus: string;
  CREATE_DT: Date;
  ApproveDt: Date;
  EditDt: Date;
  MakerId: string;
  CheckerId: string;
  EditorId: string;
  Apptoken: string;
  Domain: string;
  DomainDesc: string;

  constructor() {
    this.Id = '';
    this.UserName = '';
    this.FULLNAME = '';
    this.Password = '';
    this.Email = '';
    this.PHONE = null;
    this.ParentId = null;
    this.Description = '';
    this.RecordStatus = '';
    this.AuthStatus = '';
    this.CREATE_DT = new Date();
    this.ApproveDt = new Date();
    this.EditDt = new Date();
    this.MakerId = '';
    this.CheckerId = '';
    this.EditorId = '';
    this.Apptoken = '';
    this.Domain = '';
    this.DomainDesc = '';

  }
}
