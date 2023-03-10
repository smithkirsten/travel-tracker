import './css/styles.css';
//import 3rd party libraries
  import Swiper from 'swiper/bundle';
  import 'swiper/css/bundle';
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);
//import classes
import Traveler from '../src/Traveler';
import Trip from '../src/Trip';
import DestRepo from '../src/DestRepo'
import Agent from '../src/Agent'

//import functions
import apiCalls from '../src/apiCalls'
import display from '../src/display'
import './images/sunset.png'
import './images/blank-user-profile.png'

//query selectors
const loginButton = document.getElementById('loginButton');
const username = document.getElementById('usernameInput');
const password = document.getElementById('passwordInput');
const profileButton = document.querySelector(".profile-button");
const logoutButton = document.getElementById('logoutButton');

const filters = document.getElementById('filters');
const filteredBy = document.querySelector('.filter-content');
const estimateButton = document.getElementById('estButton');
const bookButton = document.getElementById('bookButton');
const form = document.getElementById('newTripForm');
const agentFilter = document.getElementById('agentFilter');
const agentCalendar = document.getElementById('searchDay');
const clientMenu = document.getElementById('travelersMenu');
const pendingButton = document.getElementById('pendingButton');

const cardArea = document.getElementById('swiper');

//global variables
let currentUser;
let destRepo;
let newTripEst;
let nextTripID;

//event listeners
window.addEventListener('load', () => {
  display.login(true);
});

loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  checkLogin();
  display.clearLogin();
});

profileButton.addEventListener('click', () => {
  profileButton.classList.toggle('active');
  display.logoutDrop();
});

logoutButton.addEventListener('click', () => {
  display.login(true);
  display.resetCards();
  display.logoutDrop();
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

agentFilter.addEventListener('change', (event) => {
  event.preventDefault();

  if(event.target.id === 'searchDay') {
    const date = agentCalendar.value;
    display.resetCards();
    display.agentTotals(currentUser);
    displayTripsByDay(date);
    clientMenu.value = '';
    
  }
  if(event.target.id === 'travelersMenu') {
    const traveler = +clientMenu.value;
    display.resetCards();
    displayTripsByClient(traveler);
    display.displayClient(traveler, currentUser);
    agentCalendar.value = '';
  }
})

pendingButton.addEventListener('click', (event) => {
  event.preventDefault();
  display.resetCards();
  display.agentTotals(currentUser)
  displayPendingTrips();
  agentCalendar.value = '';
  clientMenu.value = '';
})

estimateButton.addEventListener('click', (event) => {
  event.preventDefault();
  newTripEst = display.createTripEstimate(currentUser, nextTripID);
  display.tripEstimate(newTripEst, destRepo);
})

bookButton.addEventListener('click', bookTrip);

cardArea.addEventListener('click', (event) => {
  const tripID = +event.target.closest('.card').id;
  if(event.target.classList.contains('cancel-button')) {
    cancelTrip(tripID);
  }
  if(event.target.classList.contains('approve-button')) {
    approveTrip(tripID)
  }
})

//functions

function checkLogin() {
  if(username.value === 'agent' && password.value === 'travel') {
    loadForAgent();
    return;
  }
  const id = +username.value.match(/\d+/g);
  const string = username.value.slice(0, 8);
  if(string === 'username' && id <= 50 && id > 0 && password.value === 'travel') {
    loadForTraveler(id);
    display.login(false);
    display.clearLogin();
  } else {
    display.loginError();
  }
}

function loadForAgent() {
  let travelersPromise = apiCalls.getData('travelers')
  .then(data => {
    display.serverError(false);
    return data.travelers;
  })
  .catch(error => {
    display.serverError(true);
    console.log(error)
  });
  let tripsPromise = apiCalls.getData('trips')
  .then(data => {
    display.serverError(false);
    return data.trips;
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

  resolvePromises([travelersPromise, tripsPromise, destinationsPromise], 'agent');
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

  resolvePromises([travelerPromise, tripsPromise, destinationsPromise], 'traveler');
};

function resolvePromises(promisesPromises, loadAs) {
  Promise.all(promisesPromises)
    .then(values => {
      if(loadAs === 'agent') {
        assignAgentData(values);
        displayAgentDOM();
      } else {
        assignTravelerData(values);
        displayTravelerDOM();
      }
    })
  };

function assignAgentData(values) {
  const destRepo = new DestRepo(values[2]);
  const trips = values[1].map(trip => new Trip(trip));
  const travelers = values[0].map(traveler => {
    const userTrips = trips.filter(trip => trip.userID === traveler.id);
    return new Traveler (traveler, userTrips);
  });
  currentUser = new Agent(travelers, destRepo);
}
  
function assignTravelerData(values) {
  currentUser = new Traveler(values[0], []);
  nextTripID = values[1].length + 2;
  values[1]
  .filter(trip => trip.userID === currentUser.id)
  .forEach(trip => currentUser.trips.push(new Trip(trip)));
  destRepo = new DestRepo(values[2]);
}


function displayAgentDOM() {
  display.userName('agent');
  display.agentTotals(currentUser);
  displayPendingTrips();
  display.sidebar('agent');
  display.travelersDropDown(currentUser.travelers)
  display.login(false);
}

function displayTravelerDOM() {
  display.setCalendarMins();
  display.destinationsDropDown(destRepo.destinations);
  display.disableElement(estimateButton, true);
  display.sidebar('traveler')
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

function displayTripsByClient(id) {
  filteredBy.innerText = 'Client Trips';
  const trips = currentUser.findTravelerByID(id).trips;
  display.userTrips(trips, currentUser);
};

function displayTripsByDay(date) {
  const day = dayjs(date)
  filteredBy.innerText = `Trips active trips for ${dayjs(day).format('MMMM D, YYYY')}`;
  display.userTrips(currentUser.todaysTrips(day), currentUser)
};

function displayPendingTrips() {
  filteredBy.innerText = 'Pending Trips';
  display.userTrips(currentUser.pendingTrips(), currentUser)
};

function cancelTrip(tripID) {
  apiCalls.sendData('DELETE', `trips/${tripID}`)
  .then(response => {
    console.log(response)
    display.postDeclaration('cancelled');
    setTimeout(() => {
      display.resetCards();
      loadForAgent();
    }, 2000)
  })
  .catch(error => {
    console.log(error)
    display.postDeclaration(false);
    setTimeout(display.userTotals, 2000)
  })
};

function approveTrip(tripID) {
  const updatedTrip = {
    id: tripID,
    status: 'approved',
  };
  apiCalls.sendData('POST', 'updateTrip', updatedTrip)
  .then(response => {
    console.log(response)
    display.postDeclaration('approved');
    setTimeout(() => {
      display.resetCards();
      loadForAgent();
    }, 2000)
  })
  .catch(error => {
    console.log(error)
    display.postDeclaration(false);
    setTimeout(display.userTotals, 2000)
  })
};

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
