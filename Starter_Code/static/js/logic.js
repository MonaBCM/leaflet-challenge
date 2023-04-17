// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function(data) {
        createFeatures(data.features)
    });

// Create markers
function createCircleMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    });
}

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Place:</h3> ${feature.properties.place}<h3>Magnitude:</h3> ${feature.properties.mag}<h3>Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Create the base layers
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
      var grayMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

    // Create a baseMaps object
    var baseMaps = {
        "Outdoors": street,
        "Satellite": topo,
        "Grayscale": grayMap

    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        "Earthquakes": earthquakes,
       };

    // Create a map
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a layer control
    // Pass in baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap); 
//create legend

var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'legend'),
            grades = [-10,  10,  30,  50 , 70, 90],
            labels = [];

         for (var i = 0; i < grades.length; i++) {
            div.innerHTML += ('<i style="background:' + markerColor(grades[i] + 1) + '"></i> '+
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>':'+'));}
         
        return div;
 };
// Add legend to map
        legend.addTo(myMap);
}


// Increase marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 3;
}

// Change marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#b51f14' :
            depth > 70 ? '#fc8d59' :
            depth > 50 ? '#fee08b' :
            depth > 30 ? '#d9ef8b' :
            depth > 10 ? '#cdcf60':
                         '#1a9850' ;         
}
