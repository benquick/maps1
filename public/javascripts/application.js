// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults


var centerLatitude = 37.4419;
var centerLongitude = -122.1419;
var startZoom = 12;
var map;

function init() {
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map"));
		map.addControl(new GSmallMapControl());
		map.addControl(new GMapTypeControl());
		map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);

		//allow the user to click the map to create a marker
		GEvent.addListener(map, "click", function(overlay, latlng) {

		//create an HTML DOM form element
		var inputForm = document.createElement("form");
		inputForm.setAttribute("action","");
		inputForm.onsubmit = function() {createMarker(); return false;};

		//retrieve the longitude and lattitude of the click point
		var lng = latlng.lng();
		var lat = latlng.lat();

		inputForm.innerHTML = '<fieldset style="width:150px;">'
		+ '<legend>New Marker</legend>'
		+ '<label for="found">Found</label>'
		+ '<input type="text" id="found" name="m[found]" style="width:100%;"/>'
		+ '<label for="left">Left</label>'
		+ '<input type="text" id="left" name="m[left]" style="width:100%;"/>'
		+ '<input type="submit" value="Save"/>'
		+ '<input type="hidden" id="longitude" name="m[lng]" value="'+ lng +'"/>'
		+ '<input type="hidden" id="latitude" name="m[lat]" value="' + lat + '"/>'
		+ '</fieldset>';

		map.openInfoWindow (latlng,inputForm);
		map.addOverlay(marker);

		});
	}
}



window.onload = init;
window.onunload = GUnload;
