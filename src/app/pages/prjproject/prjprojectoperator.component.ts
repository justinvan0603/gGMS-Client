import {
  Component, OnInit, ViewChild, Input, Output,
  trigger,
  state,
  style,
  animate,
  transition, AfterViewChecked,
  ElementRef,
  Directive
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

import { ActivatedRoute } from '@angular/router';

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
import { PrjProject } from "./prjproject";
import { UserManager } from "../users/user-manager"
import { DataService } from "./prjproject.service";
import { DataService as ContractService}from "../contract/contract.service";
import { ContractModel } from '../contract/contract';
import { UserManagerService } from "../users/user-manager.service";
import { PrjProjectDt } from "./prjproject-dt";
import { CmAllCode } from "../cmallcode/cmallcode";
import { CmAllCodeService as AllCodeService } from "../cmallcode/cmallcode.service"



@Component({
  // moduleId: module.id,

  selector: 'prjproject',
  templateUrl: 'prjprojectoperator.component.html',

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

export class PrjProjectOperatorComponent implements AfterViewChecked {

  viewProjectForm: NgForm;

  @ViewChild('viewProjectForm') currentForm: NgForm;

  @ViewChild('childModal') public childModal: ModalDirective;
  
  @ViewChild('modal') modal: any;

  project: PrjProject;

  projectDts : PrjProjectDt[];

  contracts: ContractModel[];

  selectedContract : ContractModel;

  employees: UserManager[];

  selectedEmployees: UserManager[];

  // Contract Type lists
  contractTypes: CmAllCode[];

  // State of project
  states : CmAllCode[];
  
  apiHost: string;

  // Process type form 
  // a : add prjproject 
  // e : edit prjproject
  // v : view prjproject
  type: string;

  // id prjproject
  projectId: string;

  invalidDate: boolean = false;

  messageValidDate: string;
  
  formErrors = {
    'PROJECT_CODE': '',
    'PROJECT_NAME': ''
    //'BEGIN_DATE': '',
    //'END_DATE': '',
    //'ESTIMATE_DATE': '',
    //'COMPLETION_DATE': '',
    //'STATE': '',
    //'CONTRACT_ID': '',
    //'CONTRACT_CODE': '',
    //'CONTRACT_TYPE': '',
  };

  public isValid: boolean = true;

  validationMessages = {
    'PROJECT_CODE': {
      'required': 'Mã dự án không được để trống',
      'maxlength': 'Mã dự án phải từ 1-15 ký tự',
    },
    'PROJECT_NAME': {
      'required': 'Không được để trống tên dự án',
      'maxlength': 'Họ tên phải từ 10-256 ký tự',
    }
  };

  constructor(
    private dataService: DataService,
    private userManagerService: UserManagerService,
    private allCodeService: AllCodeService,
    private contractService : ContractService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    public utilityService: UtilityService,
    private loadingBarService: SlimLoadingBarService,
    private membershipService: MembershipService,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef) {
    this.project = new PrjProject();
    this.projectDts = new Array<PrjProjectDt>();
    this.contracts = new Array<ContractModel>();
    this.selectedContract = new ContractModel();
    this.selectedEmployees = new Array<UserManager>();
    this.employees = new Array<UserManager>();
    this.contractTypes = new Array<CmAllCode>();
    this.states = new Array<CmAllCode>();
  }


  ngOnInit() {

    this.route.params.subscribe(params => { this.type = params['type'], this.projectId = params['projectId'] });

    this.apiHost = this.configService.getApiHost();
    this.dataService.setToken(this.membershipService.getTokenUser());
    this.userManagerService.setToken(this.membershipService.getTokenUser());
    this.allCodeService.setToken(this.membershipService.getTokenUser());
    this.contractService.setToken(this.membershipService.getTokenUser());
    
    this.loadByType(this.type, this.projectId);



    //console.log(this.dataService._token);
  }
  onValueChanged(data?: any) {
    if (!this.viewProjectForm) { return; }
    const form = this.viewProjectForm.form;
    this.isValid = true;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        this.isValid = false;
        this.validDate();
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  ngAfterViewChecked(): void {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.viewProjectForm) { return; }
    this.viewProjectForm = this.currentForm;
    if (this.viewProjectForm) {
      this.viewProjectForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  loadByType(type: string, contractId: string) {
    this.loadContractTypes();
    this.loadStates();
    this.loadContracts();
    switch (type) {
      case 'a':
        this.loadAddProject();
        break;
      case 'e':
        this.loadEditProject(contractId);
        break;
      case 'v':
        this.loadViewProject(contractId);
        break;
      default:
        this.router.navigate(['/pages/prjproject/prjprojectlist']);
        break;
    }

  }

  loadAddProject() {

  }

  loadEditProject(contractId: string) {
    this.loadingBarService.start();

    this.dataService.getById(contractId).subscribe((res: PrjProject) => {

      this.project = res;

      this.loadSelectedEmployees();

     }, error => {
      this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
    });

    this.loadingBarService.complete();

  }
  
  loadViewProject(projectId: string) {
    this.loadingBarService.start();

    this.dataService.getById(projectId).subscribe((res: PrjProject) => {
      this.project = res;

      this.loadSelectedEmployees();

    }, error => {
      this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
    });
    this.loadingBarService.complete();

  }

  public validDate() {
    this.isValid = (this.project.END_DATE >= this.project.BEGIN_DATE);
    if (!this.isValid) {
      this.invalidDate = true;
      this.messageValidDate = 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
    } else {
      this.invalidDate = false;
    }
  }

  addNewProject() {

    this.loadingBarService.start();

    var user = this.membershipService.getLoggedInUser();
    this.project.MAKER_ID = user.Username;

    //console.log(domain);


    var projectDt: PrjProjectDt[] = new Array<PrjProjectDt>();

    for (let item of this.selectedEmployees) {

      var prjDt = new PrjProjectDt();
      prjDt.PROJECT_ID = this.project.PROJECT_ID;
      prjDt.PROJECT_CODE = this.project.PROJECT_CODE;
      prjDt.PROJECT_NAME = this.project.PROJECT_NAME;
      prjDt.EMPLOYEE_ID = item.UserName;
      prjDt.EMPLOYEE_NAME = item.FULLNAME;
      prjDt.MAKER_ID = user.Username;
      projectDt.push(prjDt);
    }

    if (this.selectedContract.ContractId != '') {
      this.project.CONTRACT_CODE = this.selectedContract.ContractCode;
      this.project.CONTRACT_TYPE = this.selectedContract.CONTRACT_TYPE;
    }

 

    this.dataService.createProject(this.project, projectDt)
      .subscribe(rs => {
        if (rs.Succeeded) {
          this.dataService.getByCode(this.project.PROJECT_CODE)
            .subscribe(res => {
              var pro = res;
              this.projectId = pro.PROJECT_ID;
            });
          this.router.navigate(['/pages/prjproject/prjprojectlist']);
          this.notificationService.printSuccessMessage(rs.Message);
          this.loadingBarService.complete();
        }
        else {
          this.notificationService.printErrorMessage(rs.Message);
        }
        //this.notificationService.printSuccessMessage('Thêm domain thành công');
        this.loadingBarService.complete();


      },
      error => {
        if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

          // this.utilityService.navigateToSignIn();

        }
        this.loadingBarService.complete();
        this.notificationService.printErrorMessage('Lỗi- ' + error);
      });
  }
  
  public loadSelectedEmployees(): void {

    var projectDt: PrjProjectDt[] = [];

    this.dataService.getProjectDtByProjectId(this.projectId).subscribe((res: PrjProjectDt[]) => {

      projectDt = res;

      for (let item of projectDt) {
        this.loadUser(item.EMPLOYEE_ID);
      }
    },
      error => {
        this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
      });


    this.loadingBarService.complete();
  }

  public loadUser(userId: string) {
    this.loadingBarService.start();

    this.userManagerService.getByUserName(userId).subscribe((res: UserManager) => {

      var user: UserManager = res;

      if (user != null)
        this.selectedEmployees.push(user);

      //for (var i = 0; i < this.Products.length; i++) {
      //  let r = new RecordStatus();
      //  r.Chekced = false;
      //  r.ProductID = this.Products[i].ProductId;
      //  this.ReS[i] = r;
      //}

    }, error => {
      this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
    });

    this.loadingBarService.complete();

  }


  public hideChildModal(): void {
    this.childModal.hide();
  }

  public showChildModal(): void {
    this.childModal.show();
  }
  public deleteSelectedEmployee(user: UserManager): void {
    let index = this.selectedEmployees.indexOf(user);
    this.selectedEmployees.splice(index, 1);
    this.employees.find(n => n.UserName == user.UserName).RECORD_STATUS = '0';

  }

  public searchEmployee(searchString: string): void {

    this.loadingBarService.start();

    this.userManagerService.getUsersWithSearch(1, 500, searchString) .subscribe(res => {

      this.employees = res.result;
      //var rePros = this.Products.reduce((function (pre, cur, i) {
      //  cur.RecordStatus = '0';
      //  pre[i] = cur;
      //  return pre;
      //}, {});
      //  this.Products = rePros;
      for (let item of this.employees) {
        item.RECORD_STATUS = '0';
      }
      for (let item of this.selectedEmployees) {
        if (this.employees.some(n => n.UserName == item.UserName))
          this.employees.find(n => n.UserName == item.UserName).RECORD_STATUS = '1';
      }

    },
      error => {
        this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
      });
    this.loadingBarService.complete();
  }

  public selectEmployee(user: UserManager): void {
    if (!this.selectedEmployees.some(n => n.UserName == user.UserName)) {
      this.selectedEmployees.push(user);
      this.employees.find(n => n.UserName == user.UserName).RECORD_STATUS = '1';
    }
    else {
      alert('Nhân viên này đã được thêm vào!');
    }
  }


  public editProject(): void {
    this.loadingBarService.start();

    var user = this.membershipService.getLoggedInUser();
    this.project.EDITOR_ID = user.Username;

    var prjDt: PrjProjectDt[] = new Array<PrjProjectDt>();

    for (let item of this.selectedEmployees) {
      var dt = new PrjProjectDt();
      dt.PROJECT_ID = this.project.PROJECT_ID;
      dt.PROJECT_CODE = this.project.PROJECT_CODE;
      dt.PROJECT_NAME = this.project.PROJECT_NAME;
      dt.EMPLOYEE_ID = item.UserName;
      dt.MAKER_ID = user.Username;
      prjDt.push(dt);
    }

    this.dataService.updateProject(this.project, prjDt)
      .subscribe(res => {
          if (res.Succeeded) {
            this.notificationService.printSuccessMessage(res.Message);
            this.router.navigate(['/pages/prjproject/prjprojectlist']);
          }
          else {
            this.notificationService.printErrorMessage(res.Message);
          }
          //this.notificationService.printSuccessMessage('Domain đã được cập nhật');

        },
        error => {
          if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

            //this.utilityService.navigateToSignIn();

          }
          this.notificationService.printErrorMessage('Cập nhật thất bại ' + error);
        });

    this.loadingBarService.complete();

  }

  public loadContractTypes(): void {

    this.allCodeService.getTypeByCode('CONTRACT_TYPE').subscribe(res => {

      this.contractTypes = res;

    }, error => {
      if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

        //this.utilityService.navigateToSignIn();

      }
      this.notificationService.printErrorMessage('Tải thất bại ' + error);
    });

  }


  public loadStates(): void {

    this.allCodeService.getTypeByCode('STATE').subscribe(res => {

      this.states = res;

    }, error => {
      if (error.status == 401 || error.status == 302 || error.status == 0 || error.status == 404) {

        //this.utilityService.navigateToSignIn();

      }
      this.notificationService.printErrorMessage('Tải thất bại ' + error);
    });

  }
  
  public unselectedUser(user: UserManager): void {

  }

  loadContracts() {
    this.contractService.getContracts(1, 100, '').subscribe(res => {
      this.contracts = res.result;
    },
    error => {
      this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
    });
  }

  selectedContractOnChange(id: string) {
    this.selectedContract = this.contracts.find(n => n.ContractId == id);
  }
  
  
}



