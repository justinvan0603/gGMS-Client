export class BotQuestion
{
    public QUESTION_ID:number;
    public CONTENT :string;
    public QUESTION_TYPE :number|null;
    public SCENARIO_ID :number|null;
    public DOMAIN_ID:number|null;
    public DOMAIN_NAME :string;
    public PREVQUESTION_ID :number|null;
    public IS_END :boolean|null;
    public RECORD_STATUS :number|null;
    public PREVANSWER_ID:number|null;
    public FORM_ID:number|null;
    public FORM_NAME :string;
    public LEVEL :number|null;

    public BotQuestion()
    {
        this.QUESTION_ID= 0;
        this.CONTENT ='';
        this.QUESTION_TYPE = null;
        this.SCENARIO_ID = null;
        this.DOMAIN_ID= null;
        this.DOMAIN_NAME ='';
        this.PREVQUESTION_ID = null;
        this.IS_END = null;
        this.RECORD_STATUS = 1;
        this.PREVANSWER_ID= null;
        this.FORM_ID= null;
        this.FORM_NAME ='';
        this.LEVEL = null;
    }
}
