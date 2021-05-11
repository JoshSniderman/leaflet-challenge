d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(earthquake_data) {
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(plate_data) {
        createFeatures(earthquake_data.features, plate_data.features);
      });
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
   
	var mapStyle = {
	  color: "orange",
	  fillOpacity: 0.5,
	  weight: 2.5
	};

  var tectonics = L.geoJSON(plateData, {
		style: mapStyle
	  });

  createMap(L.layerGroup(earthquakes), tectonics);
}


function createMap(earthquakes, tectonics) {
     
     var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });
    
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/outdoors-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
    
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });

    var baseMaps = {
        "Satellite":satellitemap,
        "Grayscale":grayscale,
        "Outdoors":outdoors,
        "Dark Map": darkmap
    };

    var overlayMaps = {
      "Tectonics Plates": tectonics,
      "Earthquakes": earthquakes
    };

    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [satellitemap, tectonics, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ["(-10)-10", "10-30", "30-50", "50-70", "70-90", "90+"];
      var colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
      var labels = [];
  
      // Add a header
      var legendInfo = "<h4>Earthquake Depth</h4>" 
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index]+"\">" + limits[index] + "</li>");
      });
  
      div.innerHTML += "<ul style=\"text-align: center\">" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
  }
  
  
