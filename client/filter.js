window.addEventListener("load", function () {
    let countriesSelector = document.getElementById('country')
    let citiesSelector = document.getElementById('city')
    
    let countriesChoosen = [];
    let  citiesChoosen = [];

    //load filters
    loadFilterCountries();
    loadFilterCities();
    loadSearchBox();

    let filterBtn = this.document.getElementById('filter-btn').addEventListener('click', (e) => {
        countriesChoosen = getMultipleSelectValues(countriesSelector);
        citiesChoosen = getMultipleSelectValues(citiesSelector);
        console.log(countriesChoosen);
        console.log(citiesChoosen);
        loadSearchBox()
    })

    function loadFilterCountries() {
        let url = `${dataServer}/get-countries`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data = data.data;
                console.log(`Countries found: ${data.length}`)
                for (let index = 0; index < data.length; index++) {
                    const country = data[index].country;
                    let option = document.createElement('option')
                    option.append(document.createTextNode(country))
                    option.value = country;
                    countriesSelector.appendChild(option)
                }
            })
    }
    
    function loadFilterCities() {
        let url = `${dataServer}/get-cities`
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data = data.data;
                console.log(`Cities found: ${data.length}`)
                for (let index = 0; index < data.length; index++) {
                    const city = data[index].city;
                    let option = document.createElement('option')
                    option.append(document.createTextNode(city))
                    option.value = city;
                    citiesSelector.appendChild(option)
                }
            })
    }
    
    function loadSearchBox() {
        let countries = countriesChoosen.length > 0 ? countriesChoosen : 0;
        let cities = citiesChoosen.length > 0 ? citiesChoosen : 0;

        let url = `${dataServer}/get-addresses?countries=${countries}&cities=${cities}`
        let addressesArr = []
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data = data.data;
                console.log(`Addresses Found: ${data.length}`)
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    addressesArr.push(element.street_address)
                }
                //console.log(addressesArr)
            })
    
        const autocompleteInput = new Autocomplete('#autocomplete', {
            search: input => {
                if (input.length < 1 && addressesArr.length>5) {
                    return []
                }
                return addressesArr.filter(address => {
                    return address.toLowerCase()
                        .includes(input.toLowerCase())
                        //.startsWith(input.toLowerCase())
                })
            }
        })
    }

    function getMultipleSelectValues(element){
        return Array.from(element.querySelectorAll("option:checked"),e=>e.value);
    }
});

