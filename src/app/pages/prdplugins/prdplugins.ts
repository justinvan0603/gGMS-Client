export class PrdPlugin{


		  PluginId 		:	string ;
          PluginCode 	:	string	;	
          PluginLocation :	string	;
          PluginName 	:	string	;
          PluginDescription: string ;
          Notes 			:string	;
          RecordStatus 		:string ;
          MakerId 			:string ;
          DepId 			:string	;	
          CreateDt 			:Date   ;
          AuthStatus 		:string	;	
          CheckerId 		:string	;	
          ApproveDt 		:Date	;
          EditorId 			:string ;
          EditDt 			:Date	;
            Price :number;
          PriceVat :number;
          Vat :number;
          DiscountAmt :number;
    constructor()
    {
        this.PluginId 			='';
        this.PluginCode 			='';
        this.PluginLocation 		='';
        this.PluginName 			='';
        this.PluginDescription 	='';
        this.Notes 				='';
        this.RecordStatus 		='';
        this.MakerId 			='';
        this.DepId 				='';
        this.CreateDt 		= new Date();
        this.AuthStatus 			='';
        this.CheckerId 			='';
        this.ApproveDt 		= new Date();
        this.EditorId 			='';
        this.EditDt 			= new Date();
        this.Price = 0;
        this.PriceVat = 0;
        this.Vat = 0;
        this.DiscountAmt = 0;
    }
}