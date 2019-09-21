(function($document) {

  var $time = $('#time'),
    $ts = $('#timestamp'),
    $temp = $('#temperature'),
    $tempVal = $('#temperature-val'),
    $hum = $('#humidity'),
    $humVal = $('#humidity-val');

  function getNow(d) {
    return d ? new Date(d) : new Date();
  }

  function updateClocks() {
    $time.text(getNow().toLocaleString());
  }

  function updateDisplays(_data) {
    var ts = _data.timestamp,
      h = _data.humidity,
      t = _data.temperature || {},
      f = t.f,
      c = t.c;

    $ts.html(ts ? ('Updated: ' + (new Date(ts)).toLocaleString()) : '')

    $temp.html(f !== undefined ? parseFloat(f.toFixed(1)) + '&deg;F' : '...');
    $tempVal.text(f);

    $hum.html(h !== undefined ? parseFloat(h.toFixed(1)) + '%' : '...');
    $humVal.text(h);
  }

  function refreshData() {
    var ms = getNow().getTime();
    $.get('/data.json?v=' + ms, updateDisplays, 'json');
  }

  $document.ready(function() {
    updateClocks();
    setInterval(updateClocks, 1E3); // 1 second

    refreshData();
    setInterval(refreshData, 5E3); // 5 seconds
  });

}($(document)));
