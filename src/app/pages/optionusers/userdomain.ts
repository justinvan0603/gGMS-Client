export class UserDomain
{
        //   Id :number;
        //   UserId :string;
        //   DomainId :string;
        //   Notes :string;
        //   constructor()
        //   {
        //       this.Id = 0;
        //       this.UserId = '';
        //       this.DomainId = '';
        //       this.Notes = '';
        //   }
          ID :number;
          USER_ID :string;
          DOMAIN_ID :string;
          NOTES :string;
          FULLNAME :string;
          USERID :string;
          PARENT_ID :number;
          constructor()
          {
              this.ID = 0;
              this.USER_ID = '';
              this.DOMAIN_ID = '';
              this.NOTES = '';
              this.FULLNAME = '';
              this.USERID = '';
              this.PARENT_ID =  0;
          }
}