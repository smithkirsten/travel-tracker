// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
//import 3rd party libraries
  // import Swiper bundle with all modules installed
  import Swiper from 'swiper/bundle';
  import 'swiper/css/bundle';
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
const loginButton = document.getElementById('loginButton');
const username = document.getElementById('usernameInput');
const password = document.getElementById('passwordInput');
const profileButton = document.querySelector(".profile-button");
const logoutButton = document.getElementById('logoutButton');

const filters = document.getElementById('filters');
const estimateButton = document.getElementById('estButton');
const bookButton = document.getElementById('bookButton');
const form = document.getElementById('newTripForm');

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
window.addEventListener('load', () => {
  display.login(true);
})

loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  checkLogin();
})

profileButton.addEventListener('click', () => {
  profileButton.classList.toggle('active');
  display.logoutDrop();
})

logoutButton.addEventListener('click', () => {
  display.login(true);
  currentUser = undefined;
});

filters.addEventListener('change', () => {
  display.resetCards();
  displayFilteredTrips(filters.value)
})

form.addEventListener('change', (event) => {
  event.preventDefault();
  if(event.target.id === 'calendarStart') {
    display.setEndCalendar();
  }
  if(display.checkAllInputs()) {
    display.disableElement(estimateButton, false);
  }
})

estimateButton.addEventListener('click', (event) => {
  event.preventDefault();
  newTripEst = display.createTripEstimate(currentUser, nextTripID);
  display.tripEstimate(newTripEst, destRepo);
})

bookButton.addEventListener('click', bookTrip);

function checkLogin() {

  if(username.value === 'agent' && password.value === 'travel') { //control for caps?
    loadForAgent();
    return;
  }
  const id = +username.value.match(/\d+/g);
  const string = username.value.slice(0, 8);
  console.log(string, id)
  if(string === 'username' && id <= 50 && id > 0 && password.value === 'travel') {
    loadForTraveler(id)
    display.login(false)
  } else {
    display.loginError()
  }
}

function loadForAgent() {
  console.log('load for agent')
}

function loadForTraveler(userId) {
  let travelerPromise = apiCalls.getData(`travelers/${userId}`)
    .then(data => {
      display.serverError(false);
      return data;
    })
    .catch(error => {
      display.serverError(true);
      console.log(error)
    });
  let tripsPromise = apiCalls.getData('trips')
    .then(data => {
      display.serverError(false);
      return data.trips
    })
    .catch(error => {
      display.serverError(true);
      console.log(error)
    });
  let destinationsPromise = apiCalls.getData('destinations')
    .then(data => {
      display.serverError(false);
      return data.destinations;
    })
    .catch(error => {
      display.serverError(true);
      console.log(error)
    });

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
  display.disableElement(estimateButton, 'true');
  display.setCalendarMins();
  display.destinationsDropDown(destRepo.destinations);
  display.disableElement(estimateButton, true);
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
  display.clearInputs();
  display.setCalendarMins();
  apiCalls.sendData('POST', 'trips', newTripEst)
  .then(response => {
    console.log(response)
    display.postDeclaration(true);
    setTimeout(() => {
      display.resetCards();
      loadForTraveler(currentUser.id);
    }, 2000)
  })
  .catch(error => {
    console.log(error)
    display.postDeclaration(false);
    setTimeout(display.userTotals, 2000)
  })
  newTripEst = undefined;
}

function displayAgentDOM() {
  //helper functions to hide Traveler display 
  //helper functions to remove hidden on Agent display
  //display pending trips on load
}
