export class BotScenario
{
    public SCENARIO_ID:number;
    public NAME :string;
    public DOMAIN_ID :number|null;
    public DOMAIN_NAME :string;
    public IS_ACTIVE :boolean|null;
    public RECORD_STATUS :number|null;

    public BotScenario()
    {
         this.SCENARIO_ID=0;
         this.NAME ='';
         this.DOMAIN_ID =null;
         this.DOMAIN_NAME ='';
         this.IS_ACTIVE =false;
         this.RECORD_STATUS =1;
    }
}