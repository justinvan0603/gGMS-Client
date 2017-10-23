import { Optionlink } from "./optionlink";
import { Option } from "./option"
import { OptionSearchObject } from "./optionsearch";
export class OptionLinkUpdateObject
{

         OPTION : OptionSearchObject;
         DOMAINLINK : Optionlink[];
         IsEditUser :string;
         IsEditLink :string;
         constructor()
         {
             this.OPTION = new OptionSearchObject();

            this.DOMAINLINK = new Array<Optionlink>();
            this.IsEditUser ='';
            this.IsEditLink ='';
         }
}