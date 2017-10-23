export class LookUpProject {
  Code: string;
  State: string;
  BeginDate: Date;
  EndDate: Date;

  constructor() {
    this.Code = '';
    this.State = '';
    this.BeginDate = new Date();
    this.EndDate = new Date();
  }
}