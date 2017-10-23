export class DomainUserUpdateObject
{
    Id: number;
    Username: string;
    DomainId: string;
    Notes: string;
    IsChecked:boolean;
    constructor()
    {
        this.Id = 0;
        this.Username = '';
        this.DomainId= '';
        this.Notes = '';
        this.IsChecked = false;
        
    }
}