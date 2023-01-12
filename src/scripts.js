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
    .then(data => data)
    .catch(error => console.log(error));
  let tripsPromise = apiCalls.getData('trips')
    .then(data => {
      return data.trips.filter(trip => trip.userID === userId)
    })
    .catch(error => console.log(error));
  let destinationsPromise = apiCalls.getData('destinations')
    .then(data => data)
    .catch(error => console.log(error));

  resolvePromises([travelerPromise, tripsPromise, destinationsPromise]);
};

function resolvePromises(promisesPromises) {
  Promise.all(promisesPromises)
    .then(values => {
      console.log('resolved values: ', values)
      assignData(values);
      //check to see what values are present and should be displayed/hidden
      
      //displayTravelerDOM
      
      //or displayAgentDOM
   
    })
  };
  
function assignData(values) {
  currentUser = new Traveler(values[0], [])
  values[1].forEach(trip => currentUser.trips.push(new Trip(trip)))
  destRepo = new DestRepo(values[3])
}
  
  