export class BotQuestionType
{
    public  QUESTIONTYPE_ID:number|null;
    public  QUESTION_TYPE :string;
    public  RECORD_STATUS :number|null;

    public BotQuestionType()
    {
        this.QUESTIONTYPE_ID=0;
        this.QUESTION_TYPE='';
        this.RECORD_STATUS=1;
    }
}