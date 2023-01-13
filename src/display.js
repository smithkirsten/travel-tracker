const dayjs = require('dayjs');
import Trip from '../src/Trip'

//query selectors
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
  if(traveler.trips.length < 1) {
    investDisp.innerText = 'Escape is calling...';
    totalTrips.innerText = 'Book your first trip';
    sassyDisp.innerText = 'and leave your real life behind';
  } else {
    investDisp.innerText = `You have invested $${traveler.calcTotalSpent(destinations)} in avoidance`
    totalTrips.innerText = `It has brought you to ${traveler.trips.length} new places`
    sassyDisp.innerText = 'but the things it has gotten you out of is priceless'
  }
}

function userTrips(trips, destinations) {
  if(!trips) {
    cardsDisplay.classList.add('hidden')
    noTripsDisplay.classList.remove('hidden')
  } else {
    console.log(trips)
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
  <article class="card" id="${trip.id}">
    <header class="card-header" style="background-image: url('${destination.image}')">
    <h3 class="card-heading">${destination.destination}</h3>
    </header>
    <section class="card-body">
      <p class="trip-date">${date}</p>
      <p class="trip-duration">duration: <span>${trip.duration}</span> days</p>
      <p class="trip-travelers">travelers: <span>${trip.travelers}</span></p>
    </section>
    <footer class="card-footer">
      <p class="trip-cost">total cost: <span>${cost}</span></p>
      <p class="trip-status">${trip.status}</p>
    </footer>
  </article>`;
};

// function setTodaysDateToMaxDate() {
// 	let today = new Date();
// 	let dd = String(today.getDate()).padStart(2, '0');
// 	let mm = String(today.getMonth() + 1).padStart(2, '0');
// 	let yyyy = today.getFullYear();
// 	today = `${yyyy}-${mm}-${dd}`;
// 	activityCalendar.setAttribute("max", today);
// 	hydrationCalendar.setAttribute("max", today);
// 	sleepCalendar.setAttribute("max", today);
// }

function calendarMax() {
  return;
}

function calendarMin() {
  return;
}

function createTripEstimate(currentUser, nextTripID) {
  //how to do trip ID????
    //store length of trip data array at GET request and increment?
    return new Trip({
    id: nextTripID,
    userID: currentUser.id, 
    destinationID: +destinationInput.value, 
    travelers: travelersInput.value,
    date: dayjs(startCalendar.value).format('YYYY/MM/DD'), 
    duration: dayjs(startCalendar.value).diff(endCalendar.value), 
    status: 'pending', 
    suggestedActivities: []
})
}

function tripEstimate(trip, destRepo) {
  travSummary.classList.add('hidden')

  nightsEst.innerText = trip.duration;
  destinationEst.innerText = destRepo.findDestByID(trip.destinationID).destination;
  guestsEst.innerText = trip.travelers;
  feeEst.innerText = trip.calcAgentFee(destRepo)
  totalEst.innerText = trip.calcAgentFee(destRepo);

  tripEst.classList.remove('hidden')
}

function clearInputs() {
  inputs.forEach(input => input.value = '');
  tripEst.classList.add('hidden')
  travSummary.classList.remove('hidden')

}


export default { userName, userTotals, userTrips, destinationsDropDown, resetCards, calendarMax, calendarMin, createTripEstimate, tripEstimate, clearInputs };