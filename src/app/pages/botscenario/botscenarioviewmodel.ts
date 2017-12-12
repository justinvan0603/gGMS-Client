import { BotScenario } from "./botscenario";
import { BotQuestion } from "./botquestion";
import { BotAnswer } from "./botanswer";

export class BotScenarioViewModel
{
    public BotScenario:BotScenario;
    public BotQuestions: BotQuestion[];
    public BotAnswers:BotAnswer[];
    public BotScenarioViewModel()
    {
        this.BotScenario = new BotScenario();
        this.BotQuestions = new Array<BotQuestion>();
        this.BotAnswers = new Array<BotAnswer>();
    }
}