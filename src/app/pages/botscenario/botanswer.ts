export class BotAnswer
{
    public ANSWER_ID :number;;
    public CONTENT :string;
    public QUESTION_ID :number|null;;
    public PREVANSWER_ID :number|null;;
    public IS_END :boolean;
    public RECORD_STATUS:number|null;;
    public LEVEL :number|null;;
    public FORM_ID :number|null;;
    public FORM_NAME :string;
    
    public BotAnswer()
    {
        this.ANSWER_ID =0;
        this.CONTENT ='';
        this.QUESTION_ID =null;
        this.PREVANSWER_ID =null;
        this.IS_END =true;
        this.RECORD_STATUS=1;
        this.LEVEL =null;
        this.FORM_ID =null;
        this.FORM_NAME ='';
    }
}