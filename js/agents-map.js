// INIT Leaflet Map
var map = L.map("map", {
      attributionControl: false,
      zoomControl: true
  }).setView(new L.LatLng(38.8333333,-96.585522), 5);
  L.tileLayer('https://api.mapbox.com/styles/v1/brenthack35/cj6qgoqbv3hor2ss0mrnes6mp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJlbnRoYWNrMzUiLCJhIjoiY2o1bXRreHB5MzhnazJ3bno4YTJqbm9pMyJ9.KVsWHfogkWPDje5qyUSpNg', {
      detectRetina: true,
      maxNativeZoom: 17
  }).addTo(map);

  // Add geocoding plugin
  var geocoder = L.control.geocoder('search-MKZrG6M').addTo(map);

  // Cluster MapPoints
  var leafletView = new PruneClusterForLeaflet(160);
  var size = 10000;
  var markers = [];

  // GET JSON
  var agents = "js/agents-usa.json";
  var request = new XMLHttpRequest();
  request.open("GET", agents, false);
  request.send(null)
  var json = JSON.parse(request.responseText);
  for (var a = 0; a < json.results.length; a++) {
    var lon = json.results[a].primaryContactInformation.address.longitude;
    var lat = json.results[a].primaryContactInformation.address.latitude;
    var name = json.results[a].firstName + " " + json.results[a].lastName;
    var firstname = json.results[a].firstName;
    var lastname = json.results[a].lastName;
    var npn = json.results[a].npn;
    var address = json.results[a].primaryContactInformation.address.street1 + "<br>" + json.results[a].primaryContactInformation.address.city  + " " + json.results[a].primaryContactInformation.address.stateAbbreviation + ", " + json.results[a].primaryContactInformation.address.zip;
    var street = json.results[a].primaryContactInformation.address.street1;
    var city = json.results[a].primaryContactInformation.address.city;
    var state = json.results[a].primaryContactInformation.address.stateAbbreviation;
    var zip = json.results[a].primaryContactInformation.address.zip;
    var email = json.results[a].primaryContactInformation.emailAddress.email;
    if (lon != 0.0 && lat != 0.0) {
      var marker = new PruneCluster.Marker(lat, lon);
      markers.push(marker);
      leafletView.RegisterMarker(marker);
      marker.data.popup = '<p>' +
        '<strong>' + 'Name: ' + '</strong>' + name + '<br>' +
        '<strong>' + 'NPN: ' + '</strong>' + npn + '<br>' +
        '<strong>' + 'Address: ' + '</strong>' + '<br>' + address + '<br>' +
        '<strong>' + 'Email: ' + '</strong>' + '<a href="mailto:'+ email +'">' + email + '</a>' +
      '</p>';
    }
  }

  console.log("finished parsing")

  // Process Marker/Clusters
  var lastUpdate = 0;
  window.setInterval(function () {
    var now = +new Date();
    if ((now - lastUpdate) < 400) {
      return;
    }
      for (i = 0; i < size / 2; ++i) {
          var coef = i < size / 8 ? 10 : 1;
          var ll = markers[i].position;
          ll.lat += (Math.random() - 0.5) * 0.00001 * coef;
          ll.lng += (Math.random() - 0.5) * 0.00002 * coef;
      }
      leafletView.ProcessView();
    lastUpdate = now;
  }, 500);
  map.addLayer(leafletView);
  var currentSizeSpan = document.getElementById('currentSize');
var updateSize = function () {
    leafletView.Cluster.Size = parseInt(this.value);
  currentSizeSpan.firstChild.data = this.value;
    var now = +new Date();
    if ((now - lastUpdate) < 400) {
      return;
    }
  leafletView.ProcessView();
  lastUpdate = now;
};
  document.getElementById('sizeInput').onchange = updateSize;
  document.getElementById('sizeInput').oninput = updateSize;
