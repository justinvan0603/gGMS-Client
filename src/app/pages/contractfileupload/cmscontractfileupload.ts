export class CmsContractFileUpload {
         ID : number;
         CONTRACT_ID : string;
         TYPE : string;
         FILE_NAME : string;
         PATH : string;
         FILE_SIZE : number;
         FILE_TYPE : string;
         NOTES : string;
         RECORD_STATUS : string;
         CREATE_DT : Date;
         AUTH_STATUS : string;
         CHECKER_ID : string;
         APPROVE_DT : Date;
         EDITOR_ID : string;
         EDIT_DT : Date;
         MAKER_ID: string;

        constructor()
        {
          this.ID = 0;
          this.CONTRACT_ID = '';
          this.TYPE = '';
          this.FILE_NAME = '';
          this.PATH = '';
          this.FILE_SIZE = 0;
          this.FILE_TYPE = '';
          this.NOTES = '';
          this.RECORD_STATUS = '';
          this.CREATE_DT = new Date();
          this.AUTH_STATUS = '';
          this.CHECKER_ID = '';
          this.APPROVE_DT = new Date();
          this.EDITOR_ID = '';
          this.EDIT_DT = new Date();
          this.MAKER_ID = '';
        }
}