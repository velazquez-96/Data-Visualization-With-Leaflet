
let lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

let outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
})

let earthquakeLayer = new L.LayerGroup();
let faultLinesLayer = new L.LayerGroup();

let baseMaps = {
    Satellite: satellite,
    Grayscale: lightmap,
    Outdoors: outdoors
}

let overLayMaps = {
    Earthquakes: earthquakeLayer,
    "Fault Lines": faultLinesLayer
}

let myMap = L.map('mapid', {
    center:[37.09024, -95.712891],
    zoom:4,
    layers:[satellite, earthquakeLayer]
});


let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let link2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function chooseColor(magnitude) {
    switch (true) {
        case magnitude > 5:
            return 'red';
        case magnitude > 4:
            return '#e24e1b';
        case magnitude > 3:
            return '#ec9f05';
        case magnitude > 2:
            return '#f5bb00';
        case magnitude > 1:
            return 'yellow';
        case magnitude > 0:
            return '#04e824';
        default:
            return '#18ff6d'
    }
}

function markerSize(magnitude) {
    return magnitude * 4
}

// Grabbing GeoJSON data
d3.json(link).then(function (data) {
    console.log(data)
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
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
            layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}`)
        }

    }).addTo(earthquakeLayer);
})

d3.json(link2).then(function (tData) {
    console.log(tData)
    L.geoJson(tData, {
        style: { color: "#e6c229" }
    }).addTo(faultLinesLayer)
})

L.control.layers(baseMaps, overLayMaps).addTo(myMap);

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
legend.addTo(myMap);

