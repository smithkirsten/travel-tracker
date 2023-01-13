const dayjs = require('dayjs');

//query selectors
const welcomeMessages = document.querySelectorAll('.welcome-message');
const investDisp = document.getElementById('investDisp');
const totalTrips = document.getElementById('totalTripsDisp');
const sassyDisp = document.getElementById('sassyDisp');
const noTripsDisplay = document.getElementById('noTripsDisplay');
const cardsDisplay = document.getElementById('cardsDisplay');
const destinationsMenu = document.getElementById('destinations')

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
  if(trips.length < 1) {
    cardsDisplay.classList.add('hidden')
    noTripsDisplay.classList.remove('hidden')
  } else {
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



export default { userName, userTotals, userTrips, destinationsDropDown, resetCards };