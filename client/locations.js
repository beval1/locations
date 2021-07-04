let locationsArr = []

window.addEventListener("load", function () {
    let noLocations = document.getElementById('no-locations');

    let searchBtn = document.getElementById('add-marker-btn').addEventListener('click', (e) => {
        //prevent page refresh
        e.preventDefault();

        //formData = new FormData(filter);
        //const search = formData.get('search-field');
        const search = this.document.getElementById('search-bar').value
        // console.log(search)

        let url = `${dataServer}/get-location?search=${search}`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                //get only first result
                //if they are more than one results that might be a problem
                let location = data.data[0];
                console.log(location)
                let locationPosition = {
                    lat: Number(location.latitude),
                    lng: Number(location.longitude)
                }
                console.log(locationPosition)
                let placeTitle = location.placeName;

                location = {
                    coordinates: locationPosition,
                    country: location.country,
                    city: location.city,
                    streetAddress: location.street_address,
                    name: placeTitle
                };

                if (locationAlreadyExists(location)) {
                    this.alert("This location already exists on the map!")
                    return;
                }

                //draw it on the map
                location.marker = drawMarker(location);
                focusMapOnLocation(location.coordinates);
                //add info window
                attackInfoWindow(location);
                //add to locations array
                locationsArr.push(location);

                let locationsContainer = this.document.getElementById('location-container');
                locationsContainer.appendChild(createLocationCard(location))

                checkForNoLocations();
            })
    })

    function createLocationCard(location) {
        let divLocation = createElement('div', 'location');
        let placeNameParagraph = createElement('p', null, location.name);
        let coordinatesParagraph = createElement('p', null, `Coordinates: (${location.coordinates.lat}, ${location.coordinates.lng})`);
        let countryParagraph = createElement('p', null, `Country: ${location.country}`);
        let cityParagraph = createElement('p', null, `City: ${location.city}`);
        let streetAddressParagraph = createElement('p', null, `Street Address: ${location.streetAddress}`);
        let goToButton = createElement('button');
        goToButton.appendChild(document.createTextNode('Go To Location'));
        let deleteButton = createElement('button');
        deleteButton.appendChild(document.createTextNode('Delete'));

        divLocation.appendChild(placeNameParagraph);
        divLocation.appendChild(coordinatesParagraph);
        divLocation.appendChild(countryParagraph);
        divLocation.appendChild(cityParagraph);
        divLocation.appendChild(streetAddressParagraph);
        divLocation.appendChild(goToButton);
        divLocation.appendChild(deleteButton);

        deleteButton.addEventListener('click', (e) => onLocationDelete(e, location))
        goToButton.addEventListener('click', (e) => onGoToLocation(e, location))

        return divLocation;
    }


    function onLocationDelete(e, location) {
        let confirmed = confirm("Are you sure you want to delete this location?")
        if (!confirmed) {
            return;
        }
        //delete DOM element
        e.target.parentNode.remove();
        //delete marker from map
        deleteMarker(location.marker)
        //remove marker object from the array
        locationsArr = locationsArr.filter(item => item != location);
        checkForNoLocations();
        console.log(locationsArr)
    }

    function onGoToLocation(e, location) {
        focusMapOnLocation(location.coordinates);
    }

    function checkForNoLocations() {
        if (locationsArr.length > 0) {
            noLocations.style.display = 'none';
        } else {
            noLocations.style.display = 'block';
        }
    }

    function locationAlreadyExists(location) {
        let equal = false;
        locationsArr.forEach(l => {
            if (l.coordinates.lat == location.coordinates.lat && l.coordinates.lng == location.coordinates.lng) {
                equal = true;
            }
        })
        return equal;
    }
});