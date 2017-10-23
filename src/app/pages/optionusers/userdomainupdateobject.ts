
import { OptionSearchObject } from "../optionlinks/optionsearch";
import { UserDomain } from "./userdomain";

export class UserDomainUpdateObject
{

         OPTION : OptionSearchObject;
         DOMAINUSER : Array<UserDomain>;
         IsEditUser :string;
         IsEditLink :string;
         constructor()
         {
             this.OPTION = new OptionSearchObject();

            this.DOMAINUSER = new Array<UserDomain>();
            this.IsEditUser ='1';
            this.IsEditLink ='0';
         }
}