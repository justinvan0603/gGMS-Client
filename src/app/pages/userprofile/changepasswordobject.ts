export class ChangePasswordObject
{
    Id :String;
    UserName :String;     
    OldPassword :String;       
    NewPassword:String;
    public ChangePasswordObject()
    {
        this.Id = '';
        this.UserName = '';
        this.OldPassword = '';
        this.NewPassword = '';
    }
}