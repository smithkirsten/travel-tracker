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

//import functions
import apiCalls from '../src/apiCalls'
import display from '../src/display'
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'
import './images/sunset.png'
import './images/blank-user-profile.png'

//query selectors
const profileButton = document.querySelector(".profile-button");
const profileDownOptions = document.querySelector(".profile-dropdown-content");
const logoutButton = document.getElementById('logoutButton');
const filters = document.getElementById('filters');
const estimateButton = document.getElementById('estButton');


//global variables
let currentUser;
let destRepo;
let newTripEst;
let nextTripID;

//login
  //on page load: login page
  //verify login info
  //if user -> Get Traveler, Destinations, Trips
  //if agent -> Get TravelerS, Destinations, Trips


//event listeners
window.addEventListener('load', loadForTraveler(5))

filters.addEventListener('change', () => {
  console.log('hello!')
  display.resetCards();
  displayFilteredTrips(filters.value)
  //currently only works one time for each selection
  //cannot re-select without refreshing
})

estimateButton.addEventListener('click', (event) => {
  event.preventDefault();
  newTripEst = display.createTripEstimate(currentUser, nextTripID);
  display.tripEstimate(newTripEst, destRepo)
})



profileButton.addEventListener('click', showProfileDropDownOptions())

function loadForTraveler(userId) {
  let travelerPromise = apiCalls.getData(`travelers/${userId}`)
    .then(data => data)
    .catch(error => console.log(error));
  let tripsPromise = apiCalls.getData('trips')
    .then(data => data.trips)
    .catch(error => console.log(error));
  let destinationsPromise = apiCalls.getData('destinations')
    .then(data => data.destinations)
    .catch(error => console.log(error));

  resolvePromises([travelerPromise, tripsPromise, destinationsPromise]);
};

function resolvePromises(promisesPromises) {
  Promise.all(promisesPromises)
    .then(values => {
      //conditional based on login to assign traveler or agent login
      assignTravelerData(values);

      //conditional to displayTravelerDOM
      displayTravelerDOM();
      //or displayAgentDOM
   
    })
  };
  
function assignTravelerData(values) {
  currentUser = new Traveler(values[0], []);
  nextTripID = values[1].length + 2;
  values[1]
  .filter(trip => trip.userID === currentUser.id)
  .forEach(trip => currentUser.trips.push(new Trip(trip)));
  destRepo = new DestRepo(values[2]);
}

function displayTravelerDOM() {
  display.destinationsDropDown(destRepo.destinations);
  display.userName(currentUser.name);
  display.userTotals(currentUser, destRepo);
  display.userTrips(currentUser.trips, destRepo);
}

function displayFilteredTrips(filter) {
  switch(filter) {
    case 'upcoming':
      display.userTrips(currentUser.findTripsByDate('post', dayjs()), destRepo)
      break;
    case 'past':
      display.userTrips(currentUser.findTripsByDate('pre', dayjs()), destRepo)
      break;
    case 'pending':
      display.userTrips(currentUser.tripsByStatus('pending'), destRepo)
      break;
    default:
      display.userTrips(currentUser.trips, destRepo);
  }
}

function bookTrip() {
  //clear input fields
  //apiCalls POST
  //clear newTripEst

}

function displayAgentDOM() {
  //helper functions to hide Traveler display 
  //helper functions to remove hidden on Agent display
  //display pending trips on load
}

function showProfileDropDownOptions() {
	profileDownOptions.classList.toggle("show")
	profileDownOptions.getAttribute("aria-expanded") === "false" ? profileDownOptions.setAttribute("aria-expanded", "true") : dropDownOptions.setAttribute("aria-expanded", "false");
}
