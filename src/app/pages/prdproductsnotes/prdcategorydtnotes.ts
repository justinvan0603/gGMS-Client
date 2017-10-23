export class PrdCategoryDtNotes
{
    	CATEGORY_ID 	: string;
        PRODUCT_ID 	: string;
        NOTES 			: string;
        RECORD_STATUS 	: string;
        AUTH_STATUS 	: string;
        MAKER_ID 		: string;
        CREATE_DT 		: Date;
        CHECKER_ID 	: string;
        APPROVE_DT 	: Date;
        EDITOR_ID 		: string;
        EDIT_DT 		: Date;
        constructor()
        {
            		 this.CATEGORY_ID 	='';
         this.PRODUCT_ID 	='';
         this.NOTES 			='';
         this.RECORD_STATUS 	='';
         this.AUTH_STATUS 	='';
         this.MAKER_ID 		='';
         this.CREATE_DT 		= new Date();
         this.CHECKER_ID 	='';
         this.APPROVE_DT 	= new Date();
         this.EDITOR_ID 		='';
         this.EDIT_DT 		= new Date();
        }
}