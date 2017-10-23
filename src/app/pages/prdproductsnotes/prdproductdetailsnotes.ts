export class PrdProductDetailNotes
{
        ProductDtId 		:string;
        ProductId         :string;
         Type              :string;
          ComponentId       :string;
          Notes             :string;
          RecordStatus      :string;
          MakerId           :string;
          CreateDt       	:Date;
          AuthStatus        :string;
          CheckerId         :string;
          ApproveDt      	:Date;
          EditorId          :string;
          EditDt         	:Date;

          constructor()
          {
              this.ProductDtId 		='';
          this.ProductId        ='';
          this.Type             ='';
          this.ComponentId      ='';
          this.Notes            ='';
          this.RecordStatus     ='';
          this.MakerId          ='';
          this.CreateDt       	=new Date();
          this.AuthStatus       ='';
          this.CheckerId        ='';
          this.ApproveDt      	=new Date();
          this.EditorId         ='';
          this.EditDt         	=new Date();
          }
}