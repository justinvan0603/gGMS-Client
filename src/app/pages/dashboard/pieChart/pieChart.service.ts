import {Injectable} from '@angular/core';
import {BaThemeConfigProvider, colorHelper} from '../../../theme';
import {DataService} from "../../prjproject/prjproject.service";
import {PrjProjectOvervieweCommerces} from "../../prjproject/prjproject-overviewecommerces";
import {PrjProjectCountOverviewEcommerces} from "../../prjproject/prjproject-count_overviewecommerces";

@Injectable()
export class PieChartService {

  public prjProjectOvervieweCommerces: PrjProjectCountOverviewEcommerces
  constructor(private _baConfig:BaThemeConfigProvider, private dataService: DataService) {
  }

  getData() {


    let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;



    this.dataService.getStatistics()
      .subscribe((res: PrjProjectCountOverviewEcommerces) => {

      //  console.log(res);
          return [
            {
              color: pieColor,
              description: '$ 89,745',
              stats: '57,820',
              icon: 'person',
            }, {
              color: pieColor,
              description: 'Purchases',
              stats: '$ 89,745',
              icon: 'money',
            }, {
              color: pieColor,
              description: 'Active Users',
              stats: '178,391',
              icon: 'face',
            }, {
              color: pieColor,
              description: 'Returned',
              stats: '32,592',
              icon: 'refresh',
            }
          ];


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
}
