export class Category {
  CATEGORY_ID: string;
  TYPE_ID: string;
  CATEGORY_CODE: string;
  CATEGORY_NAME: string;
  PARENT_ID: string;
  IS_LEAF: string;
  CATEGORY_LEVEL: number;
  NOTES: string;
  RECORD_STATUS: string;
  AUTH_STATUS: string;
  MAKER_ID: string;
  CREATE_DT: Date;
  CHECKER_ID: string;
  APPROVE_DT: Date;
  EDITOR_ID: string;
  EDIT_DT: Date;
  PARENT_NAME: string;
  PARENT_CODE : string;

  constructor() {
    this.CATEGORY_ID = '';
    this.TYPE_ID = '';
    this.CATEGORY_CODE = '';
    this.CATEGORY_NAME = '';
    this.CATEGORY_LEVEL = 1;
    this.IS_LEAF = 'N';
    this.PARENT_ID = '';
    this.NOTES = '';
    this.RECORD_STATUS = '';
    this.AUTH_STATUS = '';
    this.MAKER_ID = '';
    this.CREATE_DT = new Date();
    this.CHECKER_ID = '';
    this.APPROVE_DT = new Date();
    this.EDITOR_ID = '';
    this.EDIT_DT = new Date();
    this.PARENT_NAME = '';
    this.PARENT_CODE = '';
  }
}