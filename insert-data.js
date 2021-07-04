import axios from 'axios';

const locationsPerRequest = 100;
const locationsInsertCount = 200;

const randomDataEndpoint = `https://random-data-api.com/api/address/random_address?size=${locationsPerRequest}`;
const myApiEndpoint = "http://localhost:3002/add-location"

function retrieveAndSendData() {
    axios.get(randomDataEndpoint)
        .then(response => {
            console.log(response.data);
            //JSON.stringify(location)
            for (let index = 0; index < response.data.length; index++) {
                const data = response.data[index]
                let location = {
                    country: data.country,
                    city: data.city,
                    street_address: data.street_address,
                    latitude: data.latitude,
                    longitude: data.longitude
                }
                axios({
                    method: "post",
                    url: myApiEndpoint,
                    data: location,
                }).catch(error => {
                    console.log(error.message)
                })
            }
        }).catch(error => {
            console.log(error.message);
        });
}

for (let i = 0; i < locationsInsertCount/locationsPerRequest; i++) {
    retrieveAndSendData();
}
