export class Option
{
        Id :number;
          DomainId :string;
          IsLimit :string;
          Times :number;
          Description :string;
          RecordStatus :string;
          AuthStatus :string;
          CreateDt :Date;
          ApproveDt :Date;
          EditDt :Date;
          MakerId :string;
          CheckerId :string;
          EditorId :string;
          constructor()
          {
            this.Id =0;
            this.DomainId ='';
            this.IsLimit ='';
            this.Times =0;
            this.Description ='';
            this.RecordStatus ='';
            this.AuthStatus ='';
            this.CreateDt =new Date();
            this.ApproveDt = new Date();
            this.EditDt =new Date();
            this.MakerId ='';
            this.CheckerId ='';
            this.EditorId ='';
          }
}