export class BotCustomerInfo
{
    public  CUSTOMER_ID :number;
    public  DOMAIN_ID :number;
    public  DOMAIN_NAME :string;
    public  NAME :string;
    public  EMAIL :string;
    public  PHONE :string;
    public  RECORD_STATUS:number;

    public BotCustomerInfo()
    {
        this.CUSTOMER_ID=0;
        this.DOMAIN_ID =0;
        this.DOMAIN_NAME ='';
        this.NAME ='';
        this.EMAIL ='';
        this.PHONE ='';
        this.RECORD_STATUS=1;
    }
}