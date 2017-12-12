export class PrjProjectOvervieweCommerces {
  OVERVIEW_ECOMMERCE_ID: string;

  PROJECT_ID: string;
  PRODUCT_NAME: string;

  ITEM_REVENUE: string;
  PRODUCT_DETAIL_VIEWS: string;
  QUANTITY_ADDED_TO_CART: string;
  QUANTITY_CHECKED_OUT: string;

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
    this.OVERVIEW_ECOMMERCE_ID = '';
    this.PROJECT_ID = '';
    this.PRODUCT_NAME = '';
    this.ITEM_REVENUE = '';
    this.PRODUCT_DETAIL_VIEWS = '';
    this.QUANTITY_ADDED_TO_CART = '';
    this.QUANTITY_CHECKED_OUT = '';
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
