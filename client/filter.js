window.addEventListener("load", function () {
    let countriesSelector = document.getElementById('country')
    let citiesSelector = document.getElementById('city')
    
    let countriesChoosen = [];
    let  citiesChoosen = [];

    //load filters
    loadFilterCountries();
    loadFilterCities();
    loadSearchBox();

    countriesSelector.addEventListener('change', () => {
        countriesChoosen = getMultipleSelectValues(countriesSelector);
        toggleSelectors();
        loadFilterCities();
        toggleSelectors();
        console.log('changed')
    })

    citiesSelector.addEventListener('change', () => {
        citiesChoosen = getMultipleSelectValues(citiesSelector);
        toggleSelectors();
        loadFilterCountries();
        toggleSelectors();
        console.log('changed')
    })

    function toggleSelectors() {
        countriesSelector.disabled ? countriesSelector.disabled = false : countriesSelector.disabled = true;
        citiesSelector.disabled ? citiesSelector.disabled = false : citiesSelector.disabled = true;
    }

    let filterBtn = this.document.getElementById('filter-btn').addEventListener('click', (e) => {
        countriesChoosen = getMultipleSelectValues(countriesSelector);
        citiesChoosen = getMultipleSelectValues(citiesSelector);
        console.log(countriesChoosen);
        console.log(citiesChoosen);
        loadSearchBox()
    })

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
            })
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
                //console.log(data)
                console.log(`Addresses Found: ${data.length}`)
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    addressesArr.push(element.street)
                }
                console.log(addressesArr)
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

