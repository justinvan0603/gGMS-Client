import { BotQuestion } from "./botquestion";
import { BotAnswer } from "./botanswer";

export class QuestionAnswerMapper
{
    public BotQuestion: BotQuestion;
    public BotAnswer: BotAnswer;
    public QuestionAnswerMapper()
    {
        this.BotAnswer = new BotAnswer();
        this.BotQuestion = new BotQuestion();
    }
}