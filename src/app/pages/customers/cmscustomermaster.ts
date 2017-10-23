export class CMSCustomerMaster
{
         CustomerId :string;
          CustomerCode   :string;
          CustomerName   :string;
          CompanyName   :string;
          ContractId   :string;
           Address   :string;
           TaxCode : string;
           Value   :number;
           ExpContract :number;   
           SignContractDt : Date; 
           ChargeDt  :Date;
           Status   :string;
           DepId   :string;
           Notes   :string;
           RecordStatus   :string;
           MakerId   :string;
           CreateDt   :Date;
           AuthStatus   :string;
           CheckerId   :string;
           ApproveDt   :Date;
           EditorId   :string;
          EditDt   :Date;
           XmlTemp   :string;
           DataTemp   :string;
           Email   :string;
           EmailConfirmed   :boolean;
           PasswordHash   :string;
           SecurityStamp   :string;
           PhoneNumber   :string;
           PhoneNumberConfirmed   :boolean;
           TwoFactorEnabled   :boolean;
           LockoutEndDateUtc   :Date;
           LockoutEnabled   :boolean;
           AccessFailedCount   :number;
           UserName   :string;
           
           constructor()
           {
               this.CustomerId ='';
            this.CustomerCode   ='';
            this.CustomerName   ='';
            this.CompanyName   ='';
          this.ContractId   ='';
           		   this.Address   ='';
           this.TaxCode ='';
           this.Value   =0;
           this.ExpContract =0;   
           this.SignContractDt = new Date(); 
           this.ChargeDt  = new Date();
           this.Status   ='';
           this.DepId   ='';
           this.Notes   ='';
           this.RecordStatus   ='';
           this.MakerId   ='';
           this.CreateDt   =new  Date();
           this.AuthStatus   ='';
           this.CheckerId   ='';
           this.ApproveDt   = new Date();
           this.EditorId   ='';
           this.EditDt   = new Date();
           this.XmlTemp   ='';
           this.DataTemp   ='';
           this.Email   ='';
           this.EmailConfirmed   =false;
           this.PasswordHash   ='';
           this.SecurityStamp   ='';
           this.PhoneNumber   ='';
           this.PhoneNumberConfirmed  =false;
           this.TwoFactorEnabled   =false;
           this.LockoutEndDateUtc   =new Date();
           this.LockoutEnabled   = false;
           this.AccessFailedCount   =0;
           this.UserName   ='';
           }
}