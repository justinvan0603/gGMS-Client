

gapi.analytics.ready(function () {

  /**
   * Authorize the user immediately if the user has already granted access.
   * If no access has been created, render an authorize button inside the
   * element with the ID "embed-api-auth-container".
   */
  gapi.analytics.auth.authorize({
    container: 'embed-api-auth-container',
    clientid: '864154690044-1em0faelivbkeql49r5i39is7fromo8o.apps.googleusercontent.com'
  });


  /**
   * Create a new ActiveUsers instance to be rendered inside of an
   * element with the id "active-users-container" and poll for changes every
   * five seconds.
   */
  var activeUsers = new gapi.analytics.ext.ActiveUsers({
    container: 'active-users-container',
    pollingInterval: 5
  });


  /**
   * Add CSS animation to visually show the when users come and go.
   */
  activeUsers.once('success', function () {
    var element = this.container.firstChild;
    var timeout;

    this.on('change', function (data) {
      var element = this.container.firstChild;
      var animationClass = data.delta > 0 ? 'is-increasing' : 'is-decreasing';
      element.className += (' ' + animationClass);

      clearTimeout(timeout);
      timeout = setTimeout(function () {
        element.className =
          element.className.replace(/ is-(increasing|decreasing)/g, '');
      }, 3000);
    });
  });


  /**
   * Create a new ViewSelector2 instance to be rendered inside of an
   * element with the id "view-selector-container".
   */
  var viewSelector = new gapi.analytics.ext.ViewSelector2({
    container: 'view-selector-container',
  })
    .execute();


  /**
   * Update the activeUsers component, the Chartjs charts, and the dashboard
   * title whenever the user changes the view.
   */
  viewSelector.on('viewChange', function (data) {
    var title = document.getElementById('view-name');
    title.textContent = data.property.name + ' (' + data.view.name + ')';

    // Start tracking active users for this view.
    activeUsers.set(data).execute();

    // Render all the of charts for this view.
    renderWeekOverWeekChart(data.ids);
    renderYearOverYearChart(data.ids);
    renderTopBrowsersChart(data.ids);
    renderTopCountriesChart(data.ids);

    dataChart.set({query: {ids: data.ids}}).execute();
    productListPerformance.set({query: {ids: data.ids}}).execute();
    shoppingBehavior.set({query: {ids: data.ids}}).execute();
   // renderChartEcommerce(data.ids);
  });


  var dataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:itemRevenue,ga:productDetailViews,ga:quantityAddedToCart,ga:quantityCheckedOut',
      dimensions: 'ga:productName',
      'start-date': '30daysAgo',
      'end-date': 'today',
      'filters' :	'ga:itemRevenue!=0'
    },
    chart: {
      container: 'chart-container',
      type: 'LINE',
      options: {
        width: '100%'
      }
    }
  });



  var productListPerformance = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:itemRevenue,ga:productAddsToCart',
      dimensions: 'ga:productListName',
      'start-date': '30daysAgo',
      'end-date': 'today',
      //'filters' :	'ga:itemRevenue!=0'
    },
    chart: {
      container: 'productListPerformance',
      type: 'LINE',
      options: {
        width: '100%'
      }
    }
  });

  var shoppingBehavior = new gapi.analytics.googleCharts.DataChart({
    query: {
      metrics: 'ga:itemRevenue,ga:productAddsToCart',
      dimensions: 'ga:userType',
      'start-date': '30daysAgo',
      'end-date': 'today',
      //'filters' :	'ga:itemRevenue!=0'
    },
    chart: {
      container: 'shoppingBehavior',
      type: 'LINE',
      options: {
        width: '100%'
      }
    }
  });
  // function renderChartEcommerce(ids) {
  //
  //
  //
  // }
  /**
   * Draw the a chart.js line chart with data from the specified view that
   * overlays session data for the current week over session data for the
   * previous week.
   */
  function renderWeekOverWeekChart(ids) {

    // Adjust `now` to experiment with different days, for testing only...
    var now = moment(); // .subtract(3, 'day');

    var thisWeek = query({
      'ids': ids,
      'dimensions': 'ga:date,ga:nthDay',
      'metrics': 'ga:sessions',
      'start-date': moment(now).subtract(1, 'day').day(0).format('YYYY-MM-DD'),
      'end-date': moment(now).format('YYYY-MM-DD')
    });

    var lastWeek = query({
      'ids': ids,
      'dimensions': 'ga:date,ga:nthDay',
      'metrics': 'ga:sessions',
      'start-date': moment(now).subtract(1, 'day').day(0).subtract(1, 'week')
        .format('YYYY-MM-DD'),
      'end-date': moment(now).subtract(1, 'day').day(6).subtract(1, 'week')
        .format('YYYY-MM-DD')
    });

    Promise.all([thisWeek, lastWeek]).then(function (results) {

      var data1 = results[0].rows.map(function (row) { return +row[2]; });
      var data2 = results[1].rows.map(function (row) { return +row[2]; });
      var labels = results[1].rows.map(function (row) { return +row[0]; });

      labels = labels.map(function (label) {
        return moment(label, 'YYYYMMDD').format('ddd');
      });

      var data = {
        labels: labels,
        datasets: [
          {
            label: 'Last Week',
            fillColor: 'rgba(220,220,220,0.5)',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            data: data2
          },
          {
            label: 'This Week',
            fillColor: 'rgba(151,187,205,0.5)',
            strokeColor: 'rgba(151,187,205,1)',
            pointColor: 'rgba(151,187,205,1)',
            pointStrokeColor: '#fff',
            data: data1
          }
        ]
      };

      new Chart(makeCanvas('chart-1-container')).Line(data);
      generateLegend('legend-1-container', data.datasets);
    });
  }


  /**
   * Draw the a chart.js bar chart with data from the specified view that
   * overlays session data for the current year over session data for the
   * previous year, grouped by month.
   */
  function renderYearOverYearChart(ids) {

    // Adjust `now` to experiment with different days, for testing only...
    var now = moment(); // .subtract(3, 'day');

    var thisYear = query({
      'ids': ids,
      'dimensions': 'ga:month,ga:nthMonth',
      'metrics': 'ga:users',
      'start-date': moment(now).date(1).month(0).format('YYYY-MM-DD'),
      'end-date': moment(now).format('YYYY-MM-DD')
    });

    var lastYear = query({
      'ids': ids,
      'dimensions': 'ga:month,ga:nthMonth',
      'metrics': 'ga:users',
      'start-date': moment(now).subtract(1, 'year').date(1).month(0)
        .format('YYYY-MM-DD'),
      'end-date': moment(now).date(1).month(0).subtract(1, 'day')
        .format('YYYY-MM-DD')
    });

    Promise.all([thisYear, lastYear]).then(function (results) {
      var data1 = results[0].rows.map(function (row) { return +row[2]; });
      var data2 = results[1].rows.map(function (row) { return +row[2]; });
      var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // Ensure the data arrays are at least as long as the labels array.
      // Chart.js bar charts don't (yet) accept sparse datasets.
      for (var i = 0, len = labels.length; i < len; i++) {
        if (data1[i] === undefined) data1[i] = null;
        if (data2[i] === undefined) data2[i] = null;
      }

      var data = {
        labels: labels,
        datasets: [
          {
            label: 'Last Year',
            fillColor: 'rgba(220,220,220,0.5)',
            strokeColor: 'rgba(220,220,220,1)',
            data: data2
          },
          {
            label: 'This Year',
            fillColor: 'rgba(151,187,205,0.5)',
            strokeColor: 'rgba(151,187,205,1)',
            data: data1
          }
        ]
      };

      new Chart(makeCanvas('chart-2-container')).Bar(data);
      generateLegend('legend-2-container', data.datasets);
    })
      .catch(function (err) {
        console.error(err.stack);
      });
  }


  /**
   * Draw the a chart.js doughnut chart with data from the specified view that
   * show the top 5 browsers over the past seven days.
   */
  function renderTopBrowsersChart(ids) {

    query({
      'ids': ids,
      'dimensions': 'ga:browser',
      'metrics': 'ga:pageviews',
      'sort': '-ga:pageviews',
      'max-results': 5
    })
      .then(function (response) {

        var data = [];
        var colors = ['#4D5360', '#949FB1', '#D4CCC5', '#E2EAE9', '#F7464A'];

        response.rows.forEach(function (row, i) {
          data.push({ value: +row[1], color: colors[i], label: row[0] });
        });

        new Chart(makeCanvas('chart-3-container')).Doughnut(data);
        generateLegend('legend-3-container', data);
      });
  }



  function renderTopCountriesChart(ids) {
    query({
      'ids': ids,
      'dimensions': 'ga:country',
      'metrics': 'ga:sessions',
      'sort': '-ga:sessions',
      'max-results': 5
    })
      .then(function (response) {

        var data = [];
        var colors = ['#4D5360', '#949FB1', '#D4CCC5', '#E2EAE9', '#F7464A'];

        response.rows.forEach(function (row, i) {
          data.push({
            label: row[0],
            value: +row[1],
            color: colors[i]
          });
        });

        new Chart(makeCanvas('chart-4-container')).Doughnut(data);
        generateLegend('legend-4-container', data);
      });
  }


  function query(params) {
    return new Promise(function (resolve, reject) {
      var data = new gapi.analytics.report.Data({ query: params });
      data.once('success', function (response) { resolve(response); })
        .once('error', function (response) { reject(response); })
        .execute();
    });
  }


  function makeCanvas(id) {
    var container = document.getElementById(id);
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    container.innerHTML = '';
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);

    return ctx;
  }



  function generateLegend(id, items) {
    var legend = document.getElementById(id);
    legend.innerHTML = items.map(function (item) {
      var color = item.color || item.fillColor;
      var label = item.label;
      return '<li><i style="background:' + color + '"></i>' +
        escapeHtml(label) + '</li>';
    }).join('');
  }


  // Set some global Chart.js defaults.
  Chart.defaults.global.animationSteps = 60;
  Chart.defaults.global.animationEasing = 'easeInOutQuart';
  Chart.defaults.global.responsive = true;
  Chart.defaults.global.maintainAspectRatio = false;



  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

});

