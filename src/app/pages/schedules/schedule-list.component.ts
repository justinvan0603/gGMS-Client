import {
    Component, OnInit, ViewChild, Input, Output,
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/core';

import { ModalDirective } from 'ng2-bootstrap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

// import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ItemsService } from '../shared/utils/items.service';
import { ConfigService } from '../shared/utils/config.service';
import { Pagination, PaginatedResult } from '../shared/interfaces';
import { NotificationService } from "../shared/utils/notification.service";
import { IScheduleT } from "./schedule.interface";
import { DataService } from "./schedules.service";


@Component({
    // moduleId: module.id,

    selector: 'schedules',
    templateUrl: 'schedule-list.component.html',
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
    ]
})
export class ScheduleListComponent {
    @ViewChild('childModal') public childModal: ModalDirective;
    schedules: IScheduleT[];
    selectedSchedules: IScheduleT;
    apiHost: string;

    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;

    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedScheduleId: number;
    selectedScheduleLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    onEdit: boolean = false;
    addingUser: boolean = false;
    constructor(
        private dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        private loadingBarService: SlimLoadingBarService) { }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.loadSchedules();
    }

    loadSchedules() {
        this.loadingBarService.start();

        this.dataService.getSchedules(this.currentPage, this.itemsPerPage)
            .subscribe((res: PaginatedResult<IScheduleT[]>) => {
                this.schedules = res.result;// schedules;
                this.totalItems = res.pagination.TotalItems;
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Failed to load schedules. ' + error);
            });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
        this.loadSchedules();
        //console.log('Page changed to: ' + event.page);
        //console.log('Number items per page: ' + event.itemsPerPage);
    };

    removeSchedule(schedule: IScheduleT) {
        this.notificationService.openConfirmationDialog('Are you sure you want to delete this schedule?',
            () => {
                this.loadingBarService.start();
                this.dataService.deleteSchedule(schedule.Id)
                    .subscribe(() => {
                        this.itemsService.removeItemFromArray<IScheduleT>(this.schedules, schedule);
                        this.notificationService.printSuccessMessage(schedule.DOMAIN + ' has been deleted.');
                        this.loadingBarService.complete();
                    },
                    error => {
                        this.loadingBarService.complete();
                        this.notificationService.printErrorMessage('Failed to delete ' + schedule.DOMAIN + ' ' + error);
                    });
            });
    }


    viewAddSchedule(schedule: IScheduleT) {
        this.onEdit = false;
        this.selectedSchedules = {  DOMAIN: '', Status: true, UpdatedDate: new Date };
        this.addingUser = true;
        this.loadingBarService.complete();
        this.selectedScheduleLoaded = true;
        this.childModal.show();

    }

     addSchedule(schedule: IScheduleT) {
        console.log(schedule);
        this.loadingBarService.start();
        this.dataService.createSchedule(schedule)
            .subscribe(() => {
                this.notificationService.printSuccessMessage('Schedule đã được Add');
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Add thất bại ' + error);
            });
   //     this.itemsService.addItemToStart<IScheduleT>(this.schedules, schedule);
            this.loadSchedules();
    }

    editSchedule(schedule: IScheduleT) {
        console.log(schedule);
        this.loadingBarService.start();
        this.onEdit = true;
        this.dataService.updateSchedule(schedule)
            .subscribe(() => {
                this.notificationService.printSuccessMessage('Schedule đã được update');
                this.loadingBarService.complete();
            },
            error => {
                this.loadingBarService.complete();
                this.notificationService.printErrorMessage('Update thất bại ' + error);
            });

    }

    viewScheduleDetails(schedule: IScheduleT) {
        this.addingUser = false;
        this.selectedSchedules = schedule;
        this.selectedSchedules.UpdatedDate = new Date(this.selectedSchedules.UpdatedDate.toString());
        this.loadingBarService.complete();
        this.selectedScheduleLoaded = true;
        this.childModal.show();
    }


    public hideChildModal(): void {
        this.childModal.hide();
    }
}