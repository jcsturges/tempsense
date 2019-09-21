(function($document) {

  var $ts = $('#timestamp');

  function getNow(d) {
    return d ? new Date(d) : new Date();
  }

  function updateClocks() {
    $ts.text(getNow().toLocaleString());
  }

  function updateDials(_data) {
    var _temp = _data.temperature || {},
      // _tempC = _temp.c || 0,
      _tempF = _temp.f || 0,
      _hum = _data.humidity || 0,
      $temp = $('#temp-dial').highcharts(),
      $hum = $('#hum-dial').highcharts();

    if ($temp) {
      $temp.series[0].points[0].update(parseFloat(_tempF.toFixed(1)), true);
      $temp.redraw();
    } else {
      Highcharts.chart('temp-dial', {
        chart: {
            type: 'gauge',
            alignTicks: false,
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: ''
        },

        pane: {
            startAngle: -150,
            endAngle: 150
        },

        // https://www.hvac.com/faq/recommended-humidity-level-home/
        yAxis: [{
          // F
            min: -20,
            max: 120,
            lineColor: '#339',
            tickColor: '#339',
            tickInterval: 10,
            minorTickColor: '#339',
            offset: -25,
            lineWidth: 2,
            labels: {
                distance: -20,
                rotation: 'auto'
            },
            tickLength: 5,
            minorTickLength: 5,
            endOnTick: false
        }, {
          // C
            min: -28.88889, // -20 F
            max: 48.88889, // 120 F
            tickPosition: 'outside',
            lineColor: '#933',
            lineWidth: 2,
            minorTickPosition: 'outside',
            tickColor: '#933',
            tickInterval: 10,
            minorTickColor: '#933',
            tickLength: 5,
            minorTickLength: 5,
            labels: {
                distance: 12,
                rotation: 'auto'
            },
            offset: -20,
            endOnTick: false
        }],

        series: [{
            name: 'Temperature',
            data: [parseFloat(_tempF.toFixed(1))],
            dataLabels: {
                useHTML: true,
                formatter: function() {
                  // var f = parseFloat(_tempF.toFixed(1)),
                  //   c = parseFloat(_tempC.toFixed(1));
                  return '<span style="color:#339">' + this.y + '&#176; F</span>';
                  // return '<span style="color:#339">' + f + ' F</span><br/>' +
                  //   '<span style="color:#933">' + c + ' C</span>';
                },
                backgroundColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#DDD'],
                        [1, '#FFF']
                    ]
                }
            },
            tooltip: {
                valueSuffix: ' F'
            }
        }]
      });
    }

    if ($hum) {
      $hum.series[0].points[0].update(Math.round(_hum), true);
    } else {
      Highcharts.chart('hum-dial', {
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: ''
        },

        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 100,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'Humidity'
            },
            plotBands: [{
                from: 0,
                to: 50,
                color: '#55BF3B' // green
            }, {
                from: 50,
                to: 75,
                color: '#DDDF0D' // yellow
            }, {
                from: 75,
                to: 100,
                color: '#DF5353' // red
            }]
        },

        series: [{
            name: 'Humidity',
            data: [Math.round(_hum)],
            dataLabels: {
              formatter: function () {
                return '' + this.y + '%';
              }
            },
            tooltip: {
                valueSuffix: '%'
            }
        }]
      });
    }

  }

  function updateSeries(_data) {
    var ts = _data.timestamp,
      _temp = _data.temperature || {},
      _tempF = _temp.f || 0,
      // _tempC = _temp.c || 0,
      $hc = $('#temp-series').highcharts(),
      series,
      point;

    if ($hc) {
      series = $hc.series[0].data;
      point = { x: getNow().getTime(), y: _tempF };
      $hc.series[0].addPoint(point, true, series.length == 120);
    } else {

      Highcharts.chart('temp-series', {
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        legend: {
          enabled: false
        },
        xAxis: {
            type: 'datetime',
            // dateTimeLabelFormats: { // don't display the dummy year
            //     month: '%e. %b',
            //     year: '%b'
            // },
            title: {
                text: 'Time'
            }
        },
        yAxis: {
            title: {
                text: 'Temperature (F)'
            },
            min: -20,
            max: 120
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%b %e %H:%M:%S}: {point.y:.2f} F'
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            }
        },

        // colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

        // Define the data points. All series have a dummy year
        // of 1970/71 in order to be compared on the same x axis. Note
        // that in JavaScript, months start at 0 for January, 1 for February etc.
        series: [{
            name: "Temperature",
            data: [
                [getNow(ts).getTime(), _tempF]
            ]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    plotOptions: {
                        series: {
                            marker: {
                                radius: 2.5
                            }
                        }
                    }
                }
            }]
        }
      });
    }
  }

  Highcharts.setOptions({
    // This is for all plots, change Date axis to local timezone
    global : {
      useUTC : false
    }
  });

  function refreshData() {
    $.get('data.json?v=' + getNow().getTime(), function(data) {
      console.log(data);
      updateDials(data);
      updateSeries(data);
    }, 'json');
  }

  $document.ready(function() {
    updateClocks();
    setInterval(updateClocks, 1E3); // 1 second

    refreshData();
    setInterval(refreshData, 5E3); // 5 seconds
  });

}($(document)));
