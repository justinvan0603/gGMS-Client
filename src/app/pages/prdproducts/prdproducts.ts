export class PrdProduct
{
        ProductId 			:string;
          ProductCode           :string;
          ProductName           :string;
          ProductLocation       :string;
          ProductType           :string;
          Notes                 :string;
          RecordStatus          :string;
          MakerId               :string;
          CreateDt           :Date;
          AuthStatus            :string;
          CheckerId             :string;
          ApproveDt          :Date;
          EditorId              :string;
          EditDt: Date;
  Price: number;
  PriceVat: number;
  Vat: number;
  DiscountAmt: number;
  Scripts : string;
          constructor()
          {
              this.ProductId 			='';
          this.ProductCode          ='';
          this.ProductName          ='';
          this.ProductLocation      ='';
          this.ProductType          ='';
          this.Notes                ='';
          this.RecordStatus         ='';
          this.MakerId              ='';
          this.CreateDt           	=new Date();
          this.AuthStatus           ='';
          this.CheckerId            ='';
          this.ApproveDt          	= new Date();
          this.EditorId             ='';
          this.EditDt = new Date();
          this.Price = 0;
          this.PriceVat = 0;
          this.Vat = 0;
          this.DiscountAmt = 0;
            this.Scripts = '';
          }
}