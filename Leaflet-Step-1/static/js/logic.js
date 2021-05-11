d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(earthquake_data) {
        createFeatures(earthquake_data.features);
  });

  function createFeatures(earthquakeData, plateData) {
	
    var earthquakes = [];
		
	for (var i = 0; i < earthquakeData.length; i++) {
		
		var depth = earthquakeData[i].geometry.coordinates.slice(2)
		
		var color = "";
		  if (depth > 90) {
			color = "#ea2c2c";
		  }
		  else if (depth > 70) {
			color = "#ea822c";
		  }
		  else if (depth > 50) {
			color = "#ee9c00";
		  }
		  else if (depth > 30) {
			color = "#eecc00";
		  }
		  else if (depth > 10) {
			color = "#d4ee00";
		  }
		  else {
			color = "#98ee00";
		  }

	  earthquakes.push(
		L.circle(earthquakeData[i].geometry.coordinates.slice(0,2).reverse(), {
		  stroke: true,
		  fillOpacity: .5,
		  color: "black",
		  fillColor: color,
		  radius:earthquakeData[i].properties.mag*30000
		}).bindPopup("<h3>" + earthquakeData[i].properties.place + "</h3><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>")
	  );
	}

  createMap(L.layerGroup(earthquakes));
}


function createMap(earthquakes) {
     
     var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });

    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [grayscale, earthquakes]
    });
    
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ["(-10)-10", "10-30", "30-50", "50-70", "70-90", "90+"];
      var colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
      var labels = [];
  
      var legendInfo = "<h4>Earthquake Depth</h4>" 
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index]+"\">" + limits[index] + "</li>");
      });
  
      div.innerHTML += "<ul style=\"text-align: center\">" + labels.join("") + "</ul>";
      return div;
    };
  
    legend.addTo(myMap);
  }
  
  
