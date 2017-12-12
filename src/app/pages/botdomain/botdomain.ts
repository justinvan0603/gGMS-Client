export class BotDomain
{
    public DOMAIN_ID :number;
    public DOMAIN :string;
    public USER_NAME :string;
    public RECORD_STATUS :number|null;
    public BotDomain()
    {
        this.DOMAIN_ID = 0;
        this.DOMAIN = '';
        this.USER_NAME = '';
        this.RECORD_STATUS = 1;
    }
}