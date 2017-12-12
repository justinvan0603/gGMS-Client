export class CwWebControl
{
    public  PROJECT_ID :string;
    public  OPERATION_STATE :string;
    public  NOTES :string;
    public  RECORD_STATUS :string;
    public  MAKER_ID :string;
    public  CREATE_DT :Date;
    public  AUTH_STATUS :string;
    public  CHECKER_ID :string;
    public  APPROVE_DT :Date;
    public  EDITOR_ID :string;
    public  EDIT_DT :Date;
    public OPERATION_NAME : string;
    public CwWebControl()
    {
          this.PROJECT_ID='';
          this.OPERATION_STATE='';
          this.NOTES ='';
          this.RECORD_STATUS ='';
          this.MAKER_ID ='';
          this.CREATE_DT = new Date();
          this.AUTH_STATUS ='';
          this.CHECKER_ID ='';
          this.APPROVE_DT = new Date();
          this.EDITOR_ID ='';
          this.EDIT_DT = new Date();
          this.OPERATION_NAME = '';
    }
}