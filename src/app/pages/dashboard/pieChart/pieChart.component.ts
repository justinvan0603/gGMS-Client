import {Component} from '@angular/core';

import {PieChartService} from './pieChart.service';

import 'easy-pie-chart/dist/jquery.easypiechart.js';
import 'style-loader!./pieChart.scss';
import {DataService} from "../../prjproject/prjproject.service";
import {UtilityService} from "../../shared/services/utility.service";
import {NotificationService} from "../../shared/utils/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {ConfigService} from "../../shared/utils/config.service";
import {ItemsService} from "../../shared/utils/items.service";
import {MembershipService} from "../../login/membership.service";
import {PaginatedResult} from "../../shared/interfaces";
import {PrjProjectOvervieweCommerces} from "../../prjproject/prjproject-overviewecommerces";
import {PrjProjectCountOverviewEcommerces} from "../../prjproject/prjproject-count_overviewecommerces";
import {BaThemeConfigProvider} from "../../../theme";

@Component({
  selector: 'pie-chart',
  templateUrl: './pieChart.html'
})
// TODO: move easypiechart to component
export class PieChart {

  public charts: Array<Object>;
  private _init = false;
  apiHost: string;

  constructor(private _pieChartService: PieChartService, private dataService: DataService,
              private itemsService: ItemsService,
              private notificationService: NotificationService,
              private configService: ConfigService,
              public utilityService: UtilityService,
              private loadingBarService: SlimLoadingBarService,
              private membershipService: MembershipService,
              private route: ActivatedRoute,
              private router: Router,
              private _baConfig:BaThemeConfigProvider) {








    this.dataService.getStatistics()
      .subscribe((res: PrjProjectCountOverviewEcommerces) => {

          let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;
          this.charts = [
            {
              color: pieColor,
              description: 'Tổng phiên truy cập',
              stats: res.SESSIONS,
              icon: 'person',
            }, {
              color: pieColor,
              description: 'Tổng số tiền',
              stats: '$'+res.TRANSACTIONREVENUE,
              icon: 'money',
            }, {
              color: pieColor,
              description: 'Tổng số lượng website',
              stats: res.COUNT_WEBSITE,
              icon: 'website',
            }, {
              color: pieColor,
              description: 'Tổng lượt xem trang',
              stats: res.PAGEVIEWS,
              icon: 'eye',
            },
            {
              color: pieColor,
              description:'Tổng lượt xem chi tiết sản phẩm',
              stats: res.PRODUCTDETAILVIEWS,
              icon: 'eye',
            }, {
              color: pieColor,
              description: 'Tổng lượt thêm sản phẩm vào giỏ hàng',
              stats: res.PRODUCTADDSTOCART,
              icon: 'eye',
            }, {
              color: pieColor,
              description: 'Tổng lượt thanh toán',
              stats: res.PRODUCTCHECKOUTS,
              icon: 'eye',
            },{
              color: pieColor,
              description: 'Tổng thời gian xem trang',
              stats: res.TIMEONPAGE+'s',
              icon: 'eye',
            }
          ];
         // this.charts = this._pieChartService.getData();

          // console.log(res);
          // return [
          //   {
          //     color: pieColor,
          //     description: '$ 89,745',
          //     stats: '57,820',
          //     icon: 'person',
          //   }, {
          //     color: pieColor,
          //     description: 'Purchases',
          //     stats: '$ 89,745',
          //     icon: 'money',
          //   }, {
          //     color: pieColor,
          //     description: 'Active Users',
          //     stats: '178,391',
          //     icon: 'face',
          //   }, {
          //     color: pieColor,
          //     description: 'Returned',
          //     stats: '32,592',
          //     icon: 'refresh',
          //   }
          // ];


          //          console.log(res);
          //  this.prjProjectOvervieweCommerces = res.result;// schedules;

          //  this.totalItems = res.pagination.TotalItems;
          // this.loadingBarService.complete();
        },
        error => {

          //  this.loadingBarService.complete();
          //   this.notificationService.printErrorMessage('Có lỗi khi tải. ' + error);
        });


  }



  ngAfterViewInit() {
    if (!this._init) {

      this.apiHost = this.configService.getApiHost();
      this.dataService.setToken(this.membershipService.getTokenUser());



      this._loadPieCharts();
      this._updatePieCharts();
      this._init = true;
    }
  }

  private _loadPieCharts() {

    jQuery('.chart').each(function () {
      let chart = jQuery(this);
      chart.easyPieChart({
        easing: 'easeOutBounce',
        onStep: function (from, to, percent) {
          jQuery(this.el).find('.percent').text(Math.round(percent));
        },
        barColor: jQuery(this).attr('data-rel'),
        trackColor: 'rgba(0,0,0,0)',
        size: 84,
        scaleLength: 0,
        animation: 2000,
        lineWidth: 9,
        lineCap: 'round',
      });
    });
  }

  private _updatePieCharts() {
    let getRandomArbitrary = (min, max) => { return Math.random() * (max - min) + min; };

    jQuery('.pie-charts .chart').each(function(index, chart) {
      jQuery(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
    });
  }
}
