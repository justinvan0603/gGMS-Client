export class Domain
{
          ID :number;
          DOMAIN :string;
          USER_ID :string;
          USERNAME :string;
          DESCRIPTION :string;
          RECORD_STATUS :string;
          AUTH_STATUS :string;
          CREATE_DT :Date;
          APPROVE_DT:Date;
          EDIT_DT :Date;
          MAKER_ID :string;
          CHECKER_ID :string;
          EDITOR_ID :string;
          FULLNAME :string;
        //    setUSERID(userid: string) :void
        //   {
        //       this.USER_ID = userid;
        //   }
        //    setUSERNAME(username:string) :void
        //   {
        //       this.USERNAME = username;
        //   }
        constructor()
        {
            this.ID =0;
            this.DOMAIN ='';
            this.USER_ID = '';
            this.USERNAME = '';
            this.DESCRIPTION = '';
            this.RECORD_STATUS = '';
            this.AUTH_STATUS = '';
            this.CREATE_DT = new Date();
            this.APPROVE_DT = new Date();
            this.EDIT_DT = new Date();
            this.MAKER_ID ='';
            this.CHECKER_ID ='';
            this.EDITOR_ID ='';
            this.FULLNAME = '';
        }
}