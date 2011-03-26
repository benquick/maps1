// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var map;
var centerLatitude = 40.6897;
var centerLongitude = -95.0446;
var startZoom = 3;

var markers = [
       {
                'latitude': 37.818361,
                'longitude': -122.478032,
                'name': 'Golden Gate Bridge'
       },
       {
                'latitude': 40.6897,
                'longitude': -74.0446,
                'name': 'Statue of Liberty'
       },
       {
                'latitude': 38.889166,
                'longitude': -77.035307,
                'name': 'Washington Monument'
      }
 ];

function addMarker(latitude, longitude, description) {
	var marker = new GMarker(new GLatLng(latitude, longitude));

	GEvent.addListener(marker, 'click',
		function() {
			marker.openInfoWindowHtml(description);
		}
	);

	map.addOverlay(marker);
}

function init()
{
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map"));
		var location = new GLatLng(centerLatitude, centerLongitude);
		map.addControl(new GSmallMapControl());
		var location = new GLatLng(centerLatitude, centerLongitude);
		map.setCenter(location, startZoom);

		for(i=0; i<markers.length; i++) {
			addMarker(markers[i].latitude, markers[i].longitude, markers[i].name);
		}

	}
}

window.onload = init;
window.onunload = GUnload;
