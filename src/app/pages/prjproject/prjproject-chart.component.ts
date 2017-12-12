import {Component, AfterViewChecked, ElementRef, trigger, state, transition, animate, style} from '@angular/core';
declare var $:any;

@Component({
  // moduleId: module.id,
  selector: 'PrjProjectChart',
  templateUrl: 'prjproject-chart.component.html',

  animations: [
    trigger('flyInOut',
      [
        state('in', style({ opacity: 1, transform: 'translateX(0)' })),
        transition('void => *',
          [
            style({
              opacity: 0,
              transform: 'translateX(-100%)'
            }),
            animate('0.5s ease-in')
          ]),
        transition('* => void',
          [
            animate('0.2s 10 ease-out',
              style({
                opacity: 0,
                transform: 'translateX(100%)'
              }))
          ])
      ])
  ],
  styles: [
    `td
{
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}`
  ]


})
export class PrjProjectChartComponent implements AfterViewChecked {
  ngAfterViewChecked(): void {
   // $('#view-selector-container > div > div:nth-child(1) > label').text('Tài khoản');
  }
  reload: number = 0;
  constructor(private elementRef: ElementRef) {
    console.log('constructor');
    // if(this.reload==0){
    //   $(location.reload());
    //   this.reload=1;
    // }

  }
  refresh(): void {
    window.location.reload();
  }
  changeLanguage():void{

    $('#view-selector-container > div > div:nth-child(1) > label').text('Tài khoản');

    $('#view-selector-container > div > div:nth-child(2) > label').text('Tên website');
    $('#view-selector-container > div > div:nth-child(3) > label').text('Chế độ xem');
    $('body > app > main > pages > div > div > prjproject > prjprojectchart > div:nth-child(12) > h4').text('Tổng quan thương mại điện tử');
    $('#chart-container > div > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(2) > g > text').text('Doanh thu');
    $('#chart-container > div > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(3) > g > text').text('Số lượt xem chi tiết');
    $('#chart-container > div > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(4) > g > text').text('Số lượng thêm vào giỏ hàng');
    $('#chart-container > div > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(5) > g > text').text('Số lượng thanh toán');


    $('body > app > main > pages > div > div > prjproject > prjprojectchart > div:nth-child(13) > h4').text('Hiệu suất sản phẩm');


    $('#productListPerformance > div > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(2) > rect:nth-child(1)').text('Doanh thu');
    $('#productListPerformance > div > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(3) > g > text').text('Số lượng thêm vào giỏ hàng');
    $('#productListPerformance > div > div > div:nth-child(1) > div > svg > g:nth-child(4) > g:nth-child(4) > g:nth-child(1) > text').text('Sản phẩm từ danh mục Category');
    $('#productListPerformance > div > div > div:nth-child(1) > div > svg > g:nth-child(4) > g:nth-child(4) > g:nth-child(2) > text').text('Sản phẩm liên quan');
    $('#productListPerformance > div > div > div:nth-child(1) > div > svg > g:nth-child(4) > g:nth-child(4) > g:nth-child(3) > text').text('Sản phẩm gần đây');


    $('body > app > main > pages > div > div > prjproject > prjprojectchart > div:nth-child(14) > h4').text('Hành vi mua sắm');


    $('#shoppingBehavior > div > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(2) > g > text').text('Doanh thu');
    $('#shoppingBehavior > div > div > div:nth-child(1) > div > svg > g:nth-child(3) > g:nth-child(3) > g > text').text('Số lượng thêm vào giỏ hàng');
    $('#shoppingBehavior > div > div > div:nth-child(1) > div > svg > g:nth-child(4) > g:nth-child(4) > g:nth-child(1) > text').text('Khách hàng mới');
    $('#shoppingBehavior > div > div > div:nth-child(1) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1)').text('Khách hàng trở lại');

    $('#shoppingBehavior > div > div > div:nth-child(1) > div > svg > g:nth-child(4) > g:nth-child(4) > g:nth-child(2) > text').text('Khách hàng trở lại');



    $('body > app > main > pages > div > div > prjproject > prjprojectchart > div:nth-child(15) > h4').text('Phiên truy cập tuần trước và tuần này');
    $('#legend-1-container > li:nth-child(1)').text('Tuần trước');
    $('#legend-1-container > li:nth-child(2)').text('Tuần này');


    $('body > app > main > pages > div > div > prjproject > prjprojectchart > div:nth-child(16) > h4').text('Lượng truy cập năm trước và năm nay (Bởi người dùng)');
    $('#legend-2-container > li:nth-child(1)').text('Năm trước');
    $('#legend-2-container > li:nth-child(2)').text('Năm nay');
    $('body > app > main > pages > div > div > prjproject > prjprojectchart > div:nth-child(17) > h4').text('Top Trình duyệt(Lượt xem)');
    $('body > app > main > pages > div > div > prjproject > prjprojectchart > div:nth-child(18) > h4').text('Top đất nước(phiên truy cập)');


    $('#chart-container > div > div > div:nth-child(1) > div > div > table > thead > tr > th:nth-child(5)').text('Số lượng thanh toán');


  }

}

