export class PrjProductPageBehaviorCommerces {
  PAGE_BEHAVIOR_ECOMMERCE_ID: string;

  PROJECT_ID: string;
  PAGE_PATH: string;

  PAGE_VIEW: string;
  PAGE_VALUE: string;
  TIME_ON_PAGE: string;
  EXIT_RATE: string;

  DIMENSIONS: string;

  DOMAIN: string;
  VERSION_INT: number;

  RECORD_STATUS: string;
  AUTH_STATUS: string;
  MAKER_ID: string;
  CREATE_DT: Date;
  CHECKER_ID: string;
  APPROVE_DT: Date;
  EDITOR_ID: string;
  EDIT_DT: Date;




  constructor() {
    this.PAGE_BEHAVIOR_ECOMMERCE_ID = '';
    this.PROJECT_ID = '';
    this.PAGE_PATH = '';
    this.PAGE_VIEW = '';
    this.PAGE_VALUE = '';
    this.TIME_ON_PAGE = '';
    this.EXIT_RATE = '';
    this.DIMENSIONS = '';
    this.DOMAIN = '';
    this.VERSION_INT = 1;
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
