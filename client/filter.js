
window.addEventListener("load", function () {
    let countriesSelector = document.getElementById('country')
    let citiesSelector = document.getElementById('city')

    let countriesChoosen = [];
    let citiesChoosen = [];

    //load filters
    loadFilterCountries();
    loadFilterCities();
    // loadSearchBox();

    countriesSelector.addEventListener('change', () => {
        countriesChoosen = getMultipleSelectValues(countriesSelector);
        toggleSelectors();
        loadFilterCities();
        // loadSearchBox();
        toggleSelectors();
        console.log('changed')
    })

    citiesSelector.addEventListener('change', () => {
        citiesChoosen = getMultipleSelectValues(citiesSelector);
        toggleSelectors();
        loadFilterCountries();
        // loadSearchBox();
        toggleSelectors();
        console.log('changed')
    })

    function toggleSelectors() {
        countriesSelector.disabled ? countriesSelector.disabled = false : countriesSelector.disabled = true;
        citiesSelector.disabled ? citiesSelector.disabled = false : citiesSelector.disabled = true;
    }

    document.getElementById("add-marker-btn").addEventListener('click', (e) => {
        e.preventDefault();

        let url = `${dataServer}/get-addresses?countries=${countriesChoosen}&cities=${citiesChoosen}`
        let locationsArr = []

        fetch(url)
            .then(response => response.json())
            .then(data => {
                data = data.data;
                console.log(data)
                console.log(`Addresses Found: ${data.length}`)
                for (let index = 0; index < data.length; index++) {
                    let location = data[index];
                    let locationPosition = {
                        lat: Number(location.latitude),
                        lng: Number(location.longitude)
                    }
                    location = {
                        coordinates: locationPosition,
                        country: location.country,
                        city: location.city,
                        streetAddress: location.street_address,
                        name: location.placeName
                    };
                    location.marker = drawMarker(location);
                    //focusMapOnLocation(location.coordinates);
                    //add info window
                    attackInfoWindow(location);
                    //add to locations array
                    locationsArr.push(location);

                    if (!inAreas(location)) {
                        //draw it on the map
                        location.marker.setMap(null)
                    }
                }
                console.log(locationsArr)
            })
    })

    function inAreas(location) {
        if (areasArr.length < 1) {
            return true;
        }
        for (let index = 0; index < areasArr.length; index++) {
            const rectangle = areasArr[index];
            console.log(location);
            console.log(rectangle);
            // let x = location.coordinates.lat;
            // let y = location.coordinates.lng;
            //let height = rectangle.coordinates.sw.Y + rectangle.coordinates.nw.Y;
            //let width = rectangle.coordinates.sw.X + rectangle.coordinates.se.X;
            // if (rectangle.coordinates.sw.X >= x && rectangle.coordinates.sw.Y >= y && rectangle.coordinates.ne.X <= x && rectangle.coordinates.ne.Y <= y) {
            //     return true;
            // }
            //insideRectangle = rectangle.area.getBounds().contains(location.marker.getPosition());
            insideRectangle = google.maps.geometry.poly.containsLocation(location.marker.getPosition(), rectangle.area);
            if (insideRectangle) {
                console.log(insideRectangle)
                return true;
            }

        }
        return false;
    }

    function getMultipleSelectValues(element) {
        return Array.from(element.querySelectorAll("option:checked"), e => e.value);
    }

    function loadFilterCountries() {
        countriesSelector.innerHTML = '';
        let option = document.createElement('option')
        option.append(document.createTextNode('All'))
        option.value = 'All';
        countriesSelector.appendChild(option)
        let url = `${dataServer}/get-countries?cities=${citiesChoosen}`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data = data.data;
                console.log(`Countries found: ${data.length}`)
                for (let index = 0; index < data.length; index++) {
                    const country = data[index].country;
                    option = document.createElement('option')
                    option.append(document.createTextNode(country))
                    option.value = country;
                    countriesSelector.appendChild(option)
                }
            });
    }

    function loadFilterCities() {
        citiesSelector.innerHTML = '';
        let option = document.createElement('option')
        option.append(document.createTextNode('All'))
        option.value = 'All';
        citiesSelector.appendChild(option)
        let url = `${dataServer}/get-cities?countries=${countriesChoosen}`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data = data.data;
                console.log(`Cities found: ${data.length}`)
                for (let index = 0; index < data.length; index++) {
                    const city = data[index].city;
                    option = document.createElement('option')
                    option.append(document.createTextNode(city))
                    option.value = city;
                    citiesSelector.appendChild(option)
                }
            });
    }

    // function loadSearchBox() {
    //     document.getElementById("search-bar").value = "";
    //     let countries = countriesChoosen.length > 0 ? countriesChoosen : 0;
    //     let cities = citiesChoosen.length > 0 ? citiesChoosen : 0;

    //     let url = `${dataServer}/get-addresses?countries=${countries}&cities=${cities}`
    //     let locationsArr = []

    //     fetch(url)
    //         .then(response => response.json())
    //         .then(data => {
    //             data = data.data;
    //             console.log(data)
    //             console.log(`Addresses Found: ${data.length}`)
    //             for (let index = 0; index < data.length; index++) {
    //                 const element = data[index];
    //                 locationsArr.push(element.street)
    //                 // if (inAreas(element)){
    //                 //     locationsArr.push(element.street)
    //                 // }
    //             }
    //             console.log(locationsArr)
    //         })

    //     const autocompleteInput = new Autocomplete('#autocomplete', {
    //         search: input => {
    //             if (input.length < 1 && locationsArr.length>5) {
    //                 return []
    //             }
    //             return locationsArr.filter(address => {
    //                 return address.toLowerCase()
    //                     .includes(input.toLowerCase())
    //                     //.startsWith(input.toLowerCase())
    //             })
    //         }
    //     })
    // }

    // let filterBtn = this.document.getElementById('filter-btn').addEventListener('click', (e) => {
    //     countriesChoosen = getMultipleSelectValues(countriesSelector);
    //     citiesChoosen = getMultipleSelectValues(citiesSelector);
    //     console.log(countriesChoosen);
    //     console.log(citiesChoosen);
    //     loadSearchBox()
    // })

});

