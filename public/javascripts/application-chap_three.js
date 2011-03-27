// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var centerLatitude = 37.4419;
var centerLongitude = -122.1419;
var startZoom = 12;
var map;

function createMarker(){

	var lng = $("longitude").value;
	var lat = $("latitude").value;
	var formValues=Form.serialize('geocache-input');

	new Ajax.Request( 'create',
	{ method: 'post',
		parameters: formValues,
		onComplete: function(request){
			//parse the result to JSON (simply by eval-ing it)
			res=eval( "(" + request.responseText + ")" );

			//check to see if it was an error or success
			if(!res.success) {
				alert(res.content);
			} else {
				//create a new marker and add its info window
				var latlng = new GLatLng(parseFloat(lat),parseFloat(lng));
				var marker = addMarkerToMap(latlng, res.content, res.icon);
				map.addOverlay(marker);
				map.closeInfoWindow();
			} // end of the res.success check
		}
	}); // end of the new Ajax.Request() call
}


function addMarkerToMap(latlng, html, iconImage) {
	if(iconImage!='') {
		var icon = new GIcon();
		icon.image = iconImage;
		icon.iconSize = new GSize(25, 25);
		icon.iconAnchor = new GPoint(14, 25);
		icon.infoWindowAnchor = new GPoint(14, 14);
		var marker = new GMarker(latlng,icon);
	} else {
		var marker = new GMarker(latlng);
	}
	GEvent.addListener(marker, 'click', function() {
		var markerHTML = html;
		marker.openInfoWindowHtml(markerHTML);
	});
	return marker;
}

function listMarkers() {
	var request = GXmlHttp.create();

	//tell the request where to retrieve data from.
	request.open('GET', 'list', true);

	//tell the request what to do when the state changes.
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			//parse the result to JSON,by eval-ing it.
			//The response is an array of markers

			markers=eval( "(" + request.responseText + ")" );

			for (var i = 0 ; i < markers.length ; i++) {
				var marker=markers[i].attributes
				var lat=marker.lat;
//
// Generates error:
// Uncaught TypeError: Cannot read property 'lat' of undefined
// request.onreadystatechangeapplication
//
				var lng=marker.lng;

				//check for lat and lng so MSIE does not error
				//on parseFloat of a null value
				if (lat && lng) {
					var latlng = new GLatLng(parseFloat(lat),parseFloat(lng));

					var html = '<div><b>Found</b> '
					+ marker.found
					+ '</div><div><b>Left</b> '
					+ marker.left
					+ '</div>';

					var iconImage = marker.icon;
					var marker = addMarkerToMap(latlng, html, iconImage);
					map.addOverlay(marker);
				} // end of if lat and lng
			} // end of for loop
		} //if
	} //function

	request.send(null);
}

function init() {
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map"));
		listMarkers();
		map.addControl(new GSmallMapControl());
		map.addControl(new GMapTypeControl());
		map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);

		//allow the user to click the map to create a marker
		GEvent.addListener(map, "click", function(overlay, latlng) {

		//create an HTML DOM form element
		var inputForm = document.createElement("form");
		inputForm.id='geocache-input';
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
		+ '<label for="left">Icon URL</label>'
		+ '<input type="text" id="icon" name="m[icon]" style="width:100%"/>'
		+ '<input type="submit" value="Save"/>'
		+ '<input type="hidden" id="longitude" name="m[lng]" value="'+ lng +'"/>'
		+ '<input type="hidden" id="latitude" name="m[lat]" value="' + lat + '"/>'
		+ '</fieldset>';

		map.openInfoWindow (latlng,inputForm);
		var marker = new GMarker(latlng)
		map.addOverlay(marker);

		});
	}
}

window.onload = init;
window.onunload = GUnload;
