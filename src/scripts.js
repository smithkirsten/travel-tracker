// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
//import 3rd party libraries
const dayjs = require('dayjs');
//import classes
import Traveler from '../src/Traveler';
import Trip from '../src/Trip';
import DestRepo from '../src/DestRepo'
import Agent from '../src/Agent'
// import Destination from '../src/Destination'
import apiCalls from '../src/apiCalls'
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'
import './images/sunset.png'
import './images/blank-user-profile.png'


//global variables
let currentUser;
let destRepo;
let newTripEst;

//login
  //on page load: login page
  //verify login info
  //if user -> Get Traveler, Destinations, Trips
  //if agent -> Get TravelerS, Destinations, Trips


//event listeners
window.addEventListener('load', loadForTraveler(5))

function loadForTraveler(userId) {
  let travelerPromise = apiCalls.getData(`travelers/${userId}`)
    .then(data => currentUser = new Traveler(data, []))
    .catch(error => console.log(error));
  let tripsPromise = apiCalls.getData('trips')
    .then(data => {
      let trips = data.trips.filter(trip => trip.userID === userId);
      trips.forEach(trip => currentUser.trips.push(new Trip(trip)))
      console.log(trips)
      console.log(currentUser.trips)
    })
    .catch(error => console.log(error));
  let destinationsPromise = apiCalls.getData('destinations')
    .then(data => destRepo = new DestRepo(data))
    .catch(error => console.log(error));

  resolvePromises([travelerPromise, tripsPromise, destinationsPromise]);
};

function resolvePromises(promisesPromises) {
  Promise.all(promisesPromises)
    .then(values => {
      console.log(values)
      //check to see what values are present and should be displayed/hidden
      //displayTravelerDOM
      //or displayAgentDOM
    })
};


