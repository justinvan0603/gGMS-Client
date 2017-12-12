export class PrjProjectDt {
  PROJECT_ID: string;

  EMPLOYEE_ID: string;
  PROJECT_CODE: string;
  PROJECT_NAME: string;
  EMPLOYEE_CODE: string;
  EMPLOYEE_NAME: string;
  STATE: string;

  NOTES: string;
  RECORD_STATUS: string;
  AUTH_STATUS: string;
  MAKER_ID: string;
  CREATE_DT: Date;
  CHECKER_ID: string;
  APPROVE_DT: Date;
  EDITOR_ID: string;
  EDIT_DT: Date;

  constructor() {
    this.PROJECT_ID = '';
    this.PROJECT_CODE = '';

    this.PROJECT_NAME = '';
    this.EMPLOYEE_ID = '';
    this.EMPLOYEE_CODE = '';
    this.EMPLOYEE_NAME = '';
    this.STATE = '';
    this.NOTES = '';
    this.RECORD_STATUS = '';
    this.AUTH_STATUS = '';
    this.MAKER_ID = '';
    this.CREATE_DT = new Date();
    this.CHECKER_ID = '';
    this.APPROVE_DT = new Date();
    this.EDITOR_ID = '';
    this.EDIT_DT = new Date();
  }
}
