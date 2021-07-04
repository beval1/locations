console.log("client script loaded")

const dataServer = "http://151.251.52.240:3002"
let map;
const mapStartingPosition = {
    lat: 42.000,
    lng: 23.644
}
const mapZoomLevel = 5;

function initMap() {
    console.log("initializing map...")

    map = new google.maps.Map(document.getElementById("map"), {
        center: mapStartingPosition,
        zoom: mapZoomLevel,
    });
}

function drawMarker(location) {
    let marker = new google.maps.Marker({
        position: location.coordinates,
        title: location.name,
        optimized: false
    });
    //set the marker on the map
    marker.setMap(map);
    return marker;
}

function attackInfoWindow(location){
    const template = `
    <div class="location">
    <p>Name: ${location.name}</p>
    <p>Coordinates: (${location.coordinates.lat}, ${location.coordinates.lng})</p>
    <p>Country: ${location.country}</p>
    <p>City: ${location.city}</p>
    <p>Street Address: ${location.streetAddress}</p>
    </div>`
    const infowindow = new google.maps.InfoWindow({
        content: template,
    });
    location.marker.addListener("click", () => {
        infowindow.open({
          anchor: location.marker,
          map,
          shouldFocus: false,
        });
    });
}

function deleteMarker(marker){
    marker.setMap(null);
}

function focusMapOnLocation(coordinates){
    let position = new google.maps.LatLng(coordinates.lat, coordinates.lng);
    map.setCenter(position)
}

//draw and return Area's center
function drawArea(coordinates, name) {
    var bounds = new google.maps.LatLngBounds();
    var i;

    // Polygon coordinates
    var polygonCoords = [
        new google.maps.LatLng(coordinates.sw.X, coordinates.sw.Y),
        new google.maps.LatLng(coordinates.se.X, coordinates.se.Y),
        new google.maps.LatLng(coordinates.ne.X, coordinates.ne.Y),
        new google.maps.LatLng(coordinates.nw.X, coordinates.nw.Y),
    ];

    for (i = 0; i < polygonCoords.length; i++) {
        bounds.extend(polygonCoords[i]);
    }

    // Construct the polygon.
    const area = new google.maps.Polygon({
        paths: polygonCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
    });
    area.setMap(map)

    // const rectangle = new google.maps.Rectangle({
    //     strokeColor: "#FF0000",
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: "#FF0000",
    //     fillOpacity: 0.35,
    //     map,
    //     bounds: {
    //       north: 33.685,
    //       south: 33.671,
    //       east: -116.234,
    //       west: -116.251,
    //     },
    //   });

    return {
        name: name,
        area: area,
        center: bounds.getCenter(),
        coordinates: coordinates
    }
}

function deleteArea(area) {
    area.setMap(null)
}

function focusMapOnArea(areaCenter) {
    let position = new google.maps.LatLng(areaCenter.lat(), areaCenter.lng());
    map.setCenter(position);
}