let mymap = L.map("mapid", {
    center: [40.7128, -74.0059],
    zoom: 4
});

// Create the tile layer
let lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//let link2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


function chooseColor(magnitude) {
    switch (true) {
        case magnitude > 5:
            return '#a40606';
        case magnitude > 4:
            return '#c84c09';
        case magnitude > 3:
            return '#f3a738';
        case magnitude > 2:
            return '#ffbf69';
        case magnitude > 1:
            return 'yellow';
        case magnitude > 0:
            return '#04e824';
        default:
            return '#18ff6d'
    }
}

//Function to display marker accordign to magnitude
function markerSize(magnitude){
    return magnitude * 4
}

// d3.json(link2).then(function(data){
//     console.log(data)
//     L.geoJson(data,{
//         style: {color:"#4b4237"}
//     }).addTo(mymap)
// })

//Grabbing GeoJSON data
// All earthquakes from the past 7 days

d3.json(link).then(function (data) {
    console.log(data)
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            // Display cirlce markers using functions for size and color depending on magnitude
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            //console.log(d3.max(feature.properties.mag))
            //For each earthquake append popup with useful information
            layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}`)
        }
        
    }).addTo(mymap);
});

//Cretate legeng specifying grades and color with the function previously defined
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [0,1,2,3,4,5]
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(mymap);
