import {ApplicationRole} from "./applicationRole";
export class ApplicationGroup {
  public ID: number;
  public Name: string;
  public Roles:ApplicationRole[];
  public Check: boolean;

  constructor() {
    this.ID = 0;
    this.Name = '';
    this.Roles=new Array<ApplicationRole>();
    this.Check = false;
  }
}
