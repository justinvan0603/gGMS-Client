import {Component} from '@angular/core';

import {TrafficChartService} from './trafficChart.service';
import * as Chart from 'chart.js';

import 'style-loader!./trafficChart.scss';
import {ActivatedRoute, Router} from "@angular/router";
import {UtilityService} from "../../shared/services/utility.service";
import {ConfigService} from "../../shared/utils/config.service";
import {DataService} from "../../prjproject/prjproject.service";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {NotificationService} from "../../shared/utils/notification.service";
import {BaThemeConfigProvider, colorHelper} from "../../../theme";
import {ItemsService} from "../../shared/utils/items.service";
import {MembershipService} from "../../login/membership.service";
import {
  PrjProjectCountOverviewEcommerces,
  StatisticsTrafficSourcesEcommerce
} from "../../prjproject/prjproject-count_overviewecommerces";

@Component({
  selector: 'traffic-chart',
  templateUrl: './trafficChart.html'
})

// TODO: move chart.js to it's own component
export class TrafficChart {

  public doughnutData: Array<Object>=[];

  public SUM_PAGEVIEW:string;
  constructor(private trafficChartService:TrafficChartService, private dataService: DataService,
  private itemsService: ItemsService,
  private notificationService: NotificationService,
  private configService: ConfigService,
  public utilityService: UtilityService,
  private loadingBarService: SlimLoadingBarService,
  private membershipService: MembershipService,
  private route: ActivatedRoute,
  private router: Router,
  private _baConfig:BaThemeConfigProvider) {

    let dashboardColors = this._baConfig.get().colors.dashboard;

    this.dataService.getStatisticsTrafficSources()
      .subscribe((res: StatisticsTrafficSourcesEcommerce[]) => {

          let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;
          //console.log(res);
          for(let i = 0; i < res.length; i++){
            //console.log("for");
            if(i==0){
              this.doughnutData.push({
                value: res[i].PAGEVIEWS,
                color: dashboardColors.white,
                highlight: colorHelper.shade(dashboardColors.white, 15),
                label: res[i].SOURCE,
                percentage:res[i].PERCENT ,
                order: 1,
              });
              this.SUM_PAGEVIEW  =res[i].SUM_PAGEVIEW;
            }
            else if(i==1){
              this.doughnutData.push({
                value: res[i].PAGEVIEWS,
                color: dashboardColors.gossip,
                highlight: colorHelper.shade(dashboardColors.gossip, 15),
                label: res[i].SOURCE,
                percentage: res[i].PERCENT,
                order: 1,
              });
            }else if(i==2){
              this.doughnutData.push({
                value: res[i].PAGEVIEWS,
                color: dashboardColors.blueStone,
                highlight: colorHelper.shade(dashboardColors.blueStone, 15),
                label: res[i].SOURCE,
                percentage: res[i].PERCENT,
                order: 1,
              });
            }
            else{
              this.doughnutData.push({
                value: res[i].PAGEVIEWS,
                color: dashboardColors.blueStone,
                highlight: colorHelper.shade(dashboardColors.blueStone, 15),
                label: res[i].SOURCE,
                percentage: 87,
                order: 1,
              });
            }

          }

          // this.doughnutData.push({
          //   value: 1500,
          //       color: dashboardColors.gossip,
          //       highlight: colorHelper.shade(dashboardColors.gossip, 15),
          //       label: 'Search engines',
          //       percentage: 22,
          //       order: 4,
          // });
          //console.log(res.length);
        //  console.log(this.doughnutData);
          //
          // this.doughnutData = [
          //   {
          //     value: 2000,
          //     color: dashboardColors.white,
          //     highlight: colorHelper.shade(dashboardColors.white, 15),
          //     label: 'Other',
          //     percentage: 87,
          //     order: 1,
          //   }, {
          //     value: 1500,
          //     color: dashboardColors.gossip,
          //     highlight: colorHelper.shade(dashboardColors.gossip, 15),
          //     label: 'Search engines',
          //     percentage: 22,
          //     order: 4,
          //   },
          // ];
     //     this.doughnutData = trafficChartService.getData();
          this._loadDoughnutCharts();

          //  this.totalItems = res.pagination.TotalItems;
          // this.loadingBarService.complete();
        },
        error => {

          //  this.loadingBarService.complete();
          //   this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
        });



  }

  ngAfterViewInit() {
    this._loadDoughnutCharts();
  }

  private _loadDoughnutCharts() {
    let el = jQuery('.chart-area').get(0) as HTMLCanvasElement;
    new Chart(el.getContext('2d')).Doughnut(this.doughnutData, {
      segmentShowStroke: false,
      percentageInnerCutout : 64,
      responsive: true
    });
  }
}
