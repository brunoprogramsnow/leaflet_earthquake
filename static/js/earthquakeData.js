var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

const earthQuakeByDay = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


function selectColor(magnitude) {
  if (magnitude > 5) {
    return '#ff0000';
  }
  else if (magnitude >= 4 && magnitude <= 5) {
    return '#ff0000';
  }
  else if (magnitude >= 3 && magnitude <= 4) {
    return '#ffa500';
  }
  else if (magnitude >= 2 && magnitude <= 3) {
    return '#ffa500';
  }
  else if (magnitude >= 1 && magnitude <= 2) {
    return '#FFFF00';
  }
  else if (magnitude >= 0 && magnitude <= 1) {
    return '#00FF00';
  }
  else {
    return '#ffffff';
  }
}

function markers(magnitude) {
  return magnitude * 18000;
}

d3.json(earthQuakeByDay, function(d) {

	let earthQuakeFeatures = d.features

	let earthQuakeTitles = [];
	earthQuakeFeatures.forEach(function(d){
		let title = d.properties.title;
		earthQuakeTitles.push(title)
	})
	console.log(earthQuakeFeatures)
	console.log(earthQuakeTitles)
  

	for(var i =0; i < earthQuakeFeatures.length; i++){
    
    function Unix_timestamp(t) {
    var dt = new Date(t*1000);
    var hr = dt.getHours();
    var m = "0" + dt.getMinutes();
    var s = "0" + dt.getSeconds();
    return hr+ ':' + m.substr(-2) + ':' + s.substr(-2);  
    }

		L.circle([earthQuakeFeatures[i].geometry.coordinates[1], earthQuakeFeatures[i].geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "#404040",
        weight: 0.5,
        fillColor: selectColor(earthQuakeFeatures[i].properties.mag),
        radius: markers(earthQuakeFeatures[i].properties.mag)
      }).bindPopup("<p><center><strong>Location:</strong> " + earthQuakeTitles[i] + "</center></p><hr><p><center><strong> Magnitude:</strong> " + earthQuakeFeatures[i].properties.mag + "</center></p>"+"<hr><p><center><strong>Incident Time:</strong> " + Unix_timestamp(earthQuakeFeatures[i].properties.time) + "</center></p>").addTo(myMap);
    }

    let legend = L.control({position: "bottomright"});

       // Legend will be called once map is displayed
    legend.onAdd = function (map) {

      let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

      // Loop through our magnitude intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' +  selectColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '-' + grades[i + 1] + '<br>' : '+');
      }

      return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);
});
