import {
    Component, OnInit, ViewChild, Input, Output,
    trigger,
    state,
    style,
    animate,
    transition, AfterViewChecked
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

// import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ItemsService } from '../shared/utils/items.service';
import { ConfigService } from '../shared/utils/config.service';
import { Pagination, PaginatedResult } from '../shared/interfaces';
import { NotificationService } from "../shared/utils/notification.service";
// import { Domain } from "./domain";

// import { ManageUser } from "./manageuser";
// import { ManageUserService } from "./manageuser.service";
import { NgForm } from "@angular/forms";
import { MembershipService } from "../login/membership.service";
import { UtilityService } from "../shared/services/utility.service";




import { Paginated } from "../messages/paginated";

import { TreeModule,TreeNode,IActionMapping,KEYS,TREE_ACTIONS } from 'angular-tree-component';
import { BotQuestionTypeService } from './questiontype.service';
import { BotScenarioService } from './botscenario.service';
import { BotScenarioViewModel } from './botscenarioviewmodel';
import { BotQuestionType } from './botquestiontype';
import { error, isUndefined } from 'util';
import { QuestionAnswerMapper } from './questionanswermapper';
import { BotQuestion } from './botquestion';
import { BotAnswer } from './botanswer';
import { BotDomainService } from '../botdomain/botdomain.service';
import { BotDomain } from '../botdomain/botdomain';
import { BotScenario } from './botscenario';




@Component({
    // moduleId: module.id,

    selector: 'botscenarios',
    templateUrl: 'botscenario-view.component.html',

    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.5s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ],
    
})
export class BotScenarioViewComponent implements AfterViewChecked    {
    viewScenarioForm : NgForm;

    @ViewChild('viewScenarioForm') currentForm: NgForm;
    @ViewChild('pluginModal') public pluginModal: ModalDirective;
    @ViewChild('sourceModal') public sourceModal: ModalDirective;
    @ViewChild('templateModal') public templateModal: ModalDirective;
    public searchString:string;
    
    public botScenarioViewModel: BotScenarioViewModel;
    public ListQuestionAnswerMapper: QuestionAnswerMapper[];
    public totalPrice: number = 0;

    apiHost: string;

    public currentQuestion :BotQuestion;
    public currentAnswer : BotAnswer;


    public botQuestionType: BotQuestionType[];
    public selectedBotQuestionType: BotQuestionType;

    public listBotDomain : BotDomain[];
    public selectedBotDomain : BotDomain;

    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    formErrors = {
    'NAME' : '',

 
  };
  public isValid: boolean = true;
  validationMessages = {
    // 'ProductCode': {
    //   'required':      'Mã sản phẩm không được để trống', 
    //   'maxlength':     'Mã sản phẩm phải từ 1-15 ký tự',
    // },
    'NAME': {
      'required':      'Tên kịch bản không được để trống', 
      'maxlength':     'Tên kịch bản phải từ 1-100 ký tự',
    },

  };


    constructor(
        private route: ActivatedRoute,
        private botQuestionTypeService: BotQuestionTypeService,
        private botDomainService: BotDomainService,
        private dataService: BotScenarioService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        public utilityService: UtilityService,
        private loadingBarService: SlimLoadingBarService,
       public router: Router,
 
        private membershipService:MembershipService
        ) { 
            
            this.botScenarioViewModel = new BotScenarioViewModel();
            this.botScenarioViewModel.BotAnswers =new Array<BotAnswer>();
            this.botScenarioViewModel.BotScenario = new BotScenario();
            this.botScenarioViewModel.BotQuestions = new Array<BotQuestion>();

            this.selectedBotQuestionType = new BotQuestionType();
            this.ListQuestionAnswerMapper = new Array<QuestionAnswerMapper>();
            this.currentAnswer = new BotAnswer();
            this.currentQuestion = new BotQuestion();
            this.listBotDomain = new Array<BotDomain>();
            this.selectedBotDomain = new BotDomain();
        }
       
 
    ngOnInit() {
        this.route.params.subscribe(params => {this.botScenarioViewModel.BotScenario.SCENARIO_ID=params['scenarioid']});
        this.dataService.set(12);
        this.apiHost = this.configService.getApiHost();
         this.dataService.setToken(this.membershipService.getTokenUser()); 
        this.botQuestionTypeService.setToken(this.membershipService.getTokenUser());
        this.botDomainService.setToken(this.membershipService.getTokenUser());
        this.loadScenarioById(this.botScenarioViewModel.BotScenario.SCENARIO_ID);
       
        this.loadDomainByUser();

    }
    loadScenarioById(id:number)
    {
        this.dataService.getScenarioById(id).subscribe(
            res =>{
                this.botScenarioViewModel = res;
                for(let question of this.botScenarioViewModel.BotQuestions)
                {
                   var item: QuestionAnswerMapper = new QuestionAnswerMapper();
                   item.BotQuestion = question;
                   item.BotAnswer = this.botScenarioViewModel.BotAnswers.find(ans => ans.QUESTION_ID === question.QUESTION_ID);
                   if(item.BotAnswer === undefined)
                   {
                       item.BotAnswer = new BotAnswer();
                       item.BotAnswer.CONTENT = '(Câu trả lời theo form nhập)';
                   }
                   this.ListQuestionAnswerMapper.push(item);
                  
                }
                console.log(this.ListQuestionAnswerMapper);
            },
            error=>{
                if(error.status == 404)
                {
                  this.utilityService.navigateToSignIn();
                  this.notificationService.printErrorMessage('Vui lòng đăng nhập tài khoản để xác thực!');
                }
                else if(error.status == 403 || error.status == 401)
                  {
                    this.utilityService.navigateToSignIn();
                    this.notificationService.printErrorMessage('Bạn không có quyền truy cập vào chức năng này!');
                  }
                  else
                    {this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);}
            }
        );
    }

    loadDomainByUser()
    {
        this.botDomainService.getDomainByUsername(this.membershipService.getLoggedInUser().Username).subscribe(
            res =>
            {
                this.listBotDomain = res;
                console.log(this.botScenarioViewModel.BotScenario.DOMAIN_ID);
              //  this.selectedBotDomain = this.listBotDomain.find(domain => domain.DOMAIN_ID === this.botScenarioViewModel.BotScenario.DOMAIN_ID);
            },
            error=>
            {
                if(error.status == 404)
                {
                  this.utilityService.navigateToSignIn();
                  this.notificationService.printErrorMessage('Vui lòng đăng nhập tài khoản để xác thực!');
                }
                else if(error.status == 403 || error.status == 401)
                  {
                    this.utilityService.navigateToSignIn();
                    this.notificationService.printErrorMessage('Bạn không có quyền truy cập vào chức năng này!');
                  }
                  else
                    {this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);}
            }

        );
    }
    loadQuestionType()
    {
        this.botQuestionTypeService.getBotQuestionType().subscribe(
            res=>{
                this.botQuestionType = res;
                
            },
            error=>{
                if(error.status == 404)
                {
                  this.utilityService.navigateToSignIn();
                  this.notificationService.printErrorMessage('Vui lòng đăng nhập tài khoản để xác thực!');
                }
                else if(error.status == 403 || error.status == 401)
                  {
                    this.utilityService.navigateToSignIn();
                    this.notificationService.printErrorMessage('Bạn không có quyền truy cập vào chức năng này!');
                  }
                  else
                    {this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);}
            }
        );
    }

ngAfterViewChecked(): void {
            this.formChanged();
    }
    formChanged()
    {
         if (this.currentForm === this.viewScenarioForm) { return; }
         this.viewScenarioForm = this.currentForm;
         if(this.viewScenarioForm)
         {
            this.viewScenarioForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
         }
    }
    onValueChanged(data?: any)
    {
        if (!this.viewScenarioForm) { return; }
        const form = this.viewScenarioForm.form;
        this.isValid = true;
        for (const field in this.formErrors) 
        {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) 
            {
                this.isValid = false;
                const messages = this.validationMessages[field];
                for (const key in control.errors) 
                {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }



}