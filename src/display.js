const dayjs = require('dayjs');
import Trip from '../src/Trip'

//query selectors
const logoutPanel = document.getElementById('logoutPanel');
const welcomeMessages = document.querySelectorAll('.welcome-message');
const noTripsDisplay = document.getElementById('noTripsDisplay');
const cardsDisplay = document.getElementById('cardsDisplay');

const travSummary = document.getElementById('travSummary');
const investDisp = document.getElementById('investDisp');
const totalTrips = document.getElementById('totalTripsDisp');
const sassyDisp = document.getElementById('sassyDisp');

const destinationsMenu = document.getElementById('destinations');
const travelersInput = document.getElementById('traverlersInput');
const destinationInput = document.getElementById('destinations');
const startCalendar = document.getElementById('calendarStart');
const endCalendar = document.getElementById('calendarEnd');
const inputs = document.querySelectorAll('.new-trip-input')

const tripEst = document.getElementById('tripEstimate');
const nightsEst = document.getElementById('nightsEst');
const destinationEst = document.getElementById('destinationEst');
const guestsEst = document.getElementById('guestsEst');
const feeEst = document.getElementById('feeEst')
const totalEst = document.getElementById('totalEst')

const postResponse = document.getElementById('postBox');
const postMessage = document.getElementById('postMessage');


function destinationsDropDown(destinations) {
  destinations.forEach(destination => {
    destinationsMenu.innerHTML += `<option value="${destination.id}">${destination.destination}</option>`
  })
}

function userName(traveler) {
  if(!traveler) {
    welcomeMessages.forEach(message => message.innerText = 'Welcome, Traveler!');
  } else {
    welcomeMessages.forEach(message => message.innerText = `Welcome, ${traveler}`);
  }
};

function userTotals(traveler, destinations) {
  travSummary.classList.remove('hidden');
  tripEst.classList.add('hidden');
  postResponse.classList.add('hidden');
  if(traveler.trips.length < 1) {
    investDisp.innerText = 'Escape is calling...';
    totalTrips.innerText = 'Book your first trip';
    sassyDisp.innerText = 'and leave your real life behind';
  } else {
    investDisp.innerHTML = `You have invested <span>$${traveler.calcTotalSpent(destinations)}</span> in avoidance`
    totalTrips.innerHTML = `It has brought you to <span>${traveler.trips.length}</span> new places`
    sassyDisp.innerHTML = 'but the things it has gotten you out of is priceless'
  }
}

function userTrips(trips, destinations) {
  if(!trips) {
    cardsDisplay.classList.add('hidden')
    noTripsDisplay.classList.remove('hidden')
  } else {
    cardsDisplay.classList.remove('hidden')
    noTripsDisplay.classList.add('hidden')
    trips.forEach(trip => {
      const destination = destinations.findDestByID(trip.destinationID)
      const tripCost = trip.calcTripCost(destinations) + trip.calcAgentFee(destinations)
      cardsDisplay.innerHTML += createTripCard(trip, tripCost, destination);
    })
  }
}

function resetCards() {
  cardsDisplay.innerHTML = '';
}

function createTripCard(trip, cost, destination) {
  const date = dayjs(trip.date).format('MMMM D, YYYY')
  return `
  <article class="card" id="${trip.id}" style="background-image: url('${destination.image}')">
    <header class="card-header">
    </header>
    <section class="card-body">
      <h3 class="card-heading">${destination.destination}</h3>
      <p class="trip-deets trip-date">${date}</p>
      <p class="trip-deets trip-duration">duration: <span>${trip.duration}</span> days</p>
      <p class="trip-deets trip-travelers">travelers: <span>${trip.travelers}</span></p>
      <footer class="card-footer">
        <p class="trip-cost">total cost: <span>$${cost}</span></p>
        <p class="trip-status">${trip.status}</p>
      </footer>
    </section>
  </article>`;
};

function setCalendarMins() {
  const today = dayjs().format('YYYY-MM-DD');
  startCalendar.setAttribute('min', today);
  endCalendar.setAttribute('min', dayjs().add(1, 'day').format('YYYY-MM-DD'));
}

function setEndCalendar() {
  if(!endCalendar.value || dayjs(endCalendar.value).isBefore(dayjs(startCalendar.value))){
    endCalendar.value = '';
    const start = dayjs(startCalendar.value) || dayjs(startCalendar.min);
    const end = start.add(1, 'day').format('YYYY-MM-DD');
    endCalendar.setAttribute('min', end);
  }
}

function checkAllInputs() {
  //cannot use .every() bc inputs is a NodeList
  let counter = 0;
  inputs.forEach(input => {
    if(input.value) {
      counter++
    }
  })
  return counter === 4 ? true : false;
}

function createTripEstimate(currentUser, nextTripID) {
  const start = dayjs(startCalendar.value);
  const end = dayjs(endCalendar.value);
    return new Trip({
      id: nextTripID,
      userID: currentUser.id, 
      destinationID: +destinationInput.value, 
      travelers: travelersInput.value,
      date: dayjs(startCalendar.value).format('YYYY/MM/DD'), 
      duration: end.diff(start, 'day'), 
      status: 'pending', 
      suggestedActivities: []
    })
}

function tripEstimate(trip, destRepo) {
  travSummary.classList.add('hidden');
  postResponse.classList.add('hidden');
  nightsEst.innerText = `${trip.duration} days in`;
  destinationEst.innerText = destRepo.findDestByID(trip.destinationID).destination;
  guestsEst.innerText = `${trip.travelers} traveler`;
  if(trip.travelers > 1){
    guestsEst.innerText += 's';
  }
  feeEst.innerText = `agent fee ${trip.calcAgentFee(destRepo)}`;
  totalEst.innerText = `total ${trip.calcTripCost(destRepo) + trip.calcAgentFee(destRepo)}`;
  tripEst.classList.remove('hidden');
}

function logoutDrop() {
  if (logoutPanel.style.display === "block") {
    logoutPanel.style.display = "none";
  } else {
    logoutPanel.style.display = "block";
  }
}

function postDeclaration(boolean) {
  tripEst.classList.add('hidden');
  travSummary.classList.add('hidden');
  if(boolean) { //if wanting to reuse for agent, can also pass in currentUser.id for user and nothing for agent and check for both arguments
    postMessage.innerText = "Your trip is booked!";
  } else {
    postMessage.innerText = "Booking unsuccessful. Please try again later.";
  }
  postResponse.classList.remove('hidden');
}

function serverError(boolean) {
  if(boolean) {
    document.querySelector('main').classList.add('hidden');
    document.getElementById('bigError').classList.remove('hidden');
  } else {
    document.querySelector('main').classList.remove('hidden');
    document.getElementById('bigError').classList.add('hidden');
  }
}

function clearInputs() {
  inputs.forEach(input => input.value = '');
  tripEst.classList.add('hidden');
  travSummary.classList.remove('hidden');
}

function disableElement(element, boolean) {
  element.disabled = boolean;
  if(boolean) {
    element.classList.add('disabled');
  } else {
    element.classList.remove('disabled');
  }
}

export default { userName, userTotals, userTrips, destinationsDropDown, resetCards, setCalendarMins, setEndCalendar, checkAllInputs, createTripEstimate, tripEstimate, logoutDrop, postDeclaration, serverError, disableElement, clearInputs };