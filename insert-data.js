import axios from 'axios';
import rrad from 'rrad';


//const locationsPerRequest = 100;
const locationsInsertCount = 10000;

//const randomDataEndpoint = `https://random-data-api.com/api/address/random_address?size=${locationsPerRequest}`;
const myApiEndpoint = "http://localhost:3002/add-location"

// function retrieveAndSendData() {
//     axios.get(randomDataEndpoint)
//         .then(response => {
//             console.log(response.data);
//             //JSON.stringify(location)
//             for (let index = 0; index < response.data.length; index++) {
//                 const data = response.data[index]
//                 let location = {
//                     country: data.country,
//                     city: data.city,
//                     street_address: data.street_address,
//                     latitude: data.latitude,
//                     longitude: data.longitude
//                 }
//                 axios({
//                     method: "post",
//                     url: myApiEndpoint,
//                     data: location,
//                 }).catch(error => {
//                     console.log(error.message)
//                 })
//             }
//         }).catch(error => {
//             console.log(error.message);
//         });
// }

function retrieveAndSendData() {
    let randomAddress = rrad.addresses[Math.floor(Math.random() * rrad.addresses.length)]
    console.log(randomAddress)
    let location = {
        country: randomAddress.state,
        city: randomAddress.city,
        street_address: randomAddress.address1,
        latitude: randomAddress.coordinates.lat,
        longitude: randomAddress.coordinates.lng
    }
    axios({
        method: "post",
        url: myApiEndpoint,
        data: location,
    }).catch(error => {
        console.log(error.message)
    })
}

for (let i = 0; i < locationsInsertCount; i++) {
    retrieveAndSendData();
}
