const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);
  import Swiper from 'swiper/bundle';
  import 'swiper/css/bundle';
import Trip from '../src/Trip';

//query selectors
const loginDisplay = document.getElementById('loginPage');
const loginErrMsg = document.getElementById('loginError');
const loginInputs = document.querySelectorAll('.login-input')

const navBar = document.querySelector('nav');
const accountDisplay = document.querySelector('main');
const profileButton = document.getElementById('profileButton')
const logoutPanel = document.getElementById('logoutPanel');
const filteredBy = document.querySelector('.filter-content');
const filters = document.getElementById('filters');
const welcomeMessages = document.querySelectorAll('.welcome-message');
const noTripsDisplay = document.getElementById('noTripsDisplay');
const cardsDisplay = document.getElementById('cardsDisplay');
const swiperWrapper = document.querySelector('.swiper-wrapper');

const tripPlanner = document.getElementById('tripPlanner');
const agentFilter = document.getElementById('agentFilter')

const travSummary = document.getElementById('travSummary');
const investDisp = document.getElementById('investDisp');
const totalTrips = document.getElementById('totalTripsDisp');
const sassyDisp = document.getElementById('sassyDisp');

const destinationsMenu = document.getElementById('destinations');
const travelersInput = document.getElementById('travelersInput');
const destinationInput = document.getElementById('destinations');
const startCalendar = document.getElementById('calendarStart');
const endCalendar = document.getElementById('calendarEnd');
const inputs = document.querySelectorAll('.new-trip-input');

const tripEst = document.getElementById('tripEstimate');
const nightsEst = document.getElementById('nightsEst');
const destinationEst = document.getElementById('destinationEst');
const guestsEst = document.getElementById('guestsEst');
const feeEst = document.getElementById('feeEst');
const totalEst = document.getElementById('totalEst');

const postResponse = document.getElementById('postBox');
const postMessage = document.getElementById('postMessage');

function login(boolean) {

  loginErrMsg.classList.add('hidden');
  if(boolean) {
    loginDisplay.classList.remove('hidden');
    accountDisplay.classList.add('hidden');
    navBar.classList.add('hidden');
  } else {
    loginDisplay.classList.add('hidden');
    accountDisplay.classList.remove('hidden');
    navBar.classList.remove('hidden');
  }
}

function sidebar(user) {
  if(user === 'agent') {
    agentFilter.classList.remove('hidden');
    tripPlanner.classList.add('hidden');
    filters.classList.add('hidden');
  } else {
    agentFilter.classList.add('hidden');
    tripPlanner.classList.remove('hidden');
    filters.classList.remove('hidden');
    filteredBy.innerText = 'Filter by';
  }
}

function destinationsDropDown(destinations) {
  destinations.forEach(destination => {
    destinationsMenu.innerHTML += `<option value="${destination.id}">${destination.destination}</option>`;
  });
}

function userName(traveler) {
  if(traveler === 'agent') {
    welcomeMessages.forEach(message => message.innerText = 'Welcome, Agent!');
  } else if(!traveler) {
    welcomeMessages.forEach(message => message.innerText = 'Welcome, Traveler!');
  } else {
    welcomeMessages.forEach(message => message.innerText = `Welcome, ${traveler}`);
  }
};

function agentTotals(currentUser) {
  travSummary.classList.remove('hidden');
  tripEst.classList.add('hidden');
  postResponse.classList.add('hidden');


  investDisp.innerText = `You have earned $${currentUser.calcYearsIncome(dayjs().year())} so far this year`;
  totalTrips.innerText = `You have ${currentUser.todaysTrips(dayjs())} clients on trips today`;
  sassyDisp.innerHTML = 'Get them to leave their troubles behind...'
}

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

function userTrips(trips, repo) { //pass in currentUser as 3rd param only if agent view
  if(!trips) {
    cardsDisplay.classList.add('hidden');
    noTripsDisplay.classList.remove('hidden');
  } else {
    cardsDisplay.classList.remove('hidden');
    noTripsDisplay.classList.add('hidden');

    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        slidesPerView: 3,
        spaceBetween: 0,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        a11y: {
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          enabled: true,
          lastSlideMessage: 'This is the last slide',
        },
        keyboard: {
          enabled: true,
          onlyInViewport: false,
        },
    })

    if(repo.destRepo) {
      trips.forEach(trip => {
        const destination = repo.destRepo.findDestByID(trip.destinationID);
        const traveler = repo.findTravelerByID(trip.userID);
        const tripCost = trip.calcTripCost(repo.destRepo);
        const fee = trip.calcAgentFee(repo.destRepo);

        swiperWrapper.innerHTML += createAgentCard(trip, traveler.name, tripCost, fee, destination);
      })

    } else if (repo.destinations){
      console.log(repo.destinations)
      trips.forEach(trip => {
        const destination = repo.findDestByID(trip.destinationID);
        const tripCost = trip.calcTripCost(repo) + trip.calcAgentFee(repo);
        swiperWrapper.innerHTML += createTripCard(trip, tripCost, destination);
      })
    }
  }
}

function createAgentCard(trip, traveler, tripCost, fee, destination) {
  const date = dayjs(trip.date).format('MMMM D, YYYY');
  return `
  <div class="swiper-slide">
    <article class="card" id="${trip.id}" style="background-image: url('${destination.image}')">
      <section class="card-body">
        <h3 class="card-heading">Trip #${trip.id}: ${traveler}</h3>
        <div class="trip-deets agent-deets">
          <p class="trip-date">${date}</p>
          <p class="trip-duration"><span>${trip.duration}</span> days, <span>${trip.travelers}</span> travelers</p>
          <p class="trip-location">${destination.destination}</p>
          <p class="trip-cost">total cost: $${tripCost}</p>
          <p id="agentFee" class="agent-fee">Agent Fee: <span>$${fee}</span></p>
        </div>
        <footer class="card-footer agent-footer">
          <button class="card-button cancel-button">cancel</button>
          <p class="trip-status">${trip.status}</p>
          <button class="card-button approve-button">approve</button>
        </footer>
      </section>
    </article>
  </div>`;

}

function createTripCard(trip, cost, destination) {
  const date = dayjs(trip.date).format('MMMM D, YYYY');
  return `
  <div class="swiper-slide">
    <article class="card" id="${trip.id}" style="background-image: url('${destination.image}')">
      <section class="card-body">
        <h3 class="card-heading">${destination.destination}</h3>
        <div class="trip-deets">
          <p class="trip-date">${date}</p>
          <p class="trip-duration">duration: <span>${trip.duration}</span> days</p>
          <p class="trip-travelers">travelers: <span>${trip.travelers}</span></p>
        </div>
        <footer class="card-footer">
          <p class="trip-cost">total cost: <span>$${cost}</span></p>
          <p class="trip-status">${trip.status}</p>
        </footer>
      </section>
    </article>
  </div>`;
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
  feeEst.innerText = `agent fee $${trip.calcAgentFee(destRepo)}`;
  totalEst.innerText = `total $${trip.calcTripCost(destRepo) + trip.calcAgentFee(destRepo)}`;
  tripEst.classList.remove('hidden');
}

function logoutDrop() {
  if (logoutPanel.style.display === "block") {
    logoutPanel.style.display = "none";
    profileButton.classList.remove('.active')
  } else {
    logoutPanel.style.display = "block";
  }
}

function postDeclaration(postStatus) {
  tripEst.classList.add('hidden');
  travSummary.classList.add('hidden');
  if(postStatus === 'true') {
    postMessage.innerText = "Your trip is booked!";
  } else if(postStatus === 'cancelled') {
    postMessage.innerText = "That trip has been cancelled";
  } else if(postStatus === 'approved') {
    postMessage.innerText = "That trip has been approved!";
  } else {
    postMessage.innerText = "Failed entry. Please try again later.";
  }
  postResponse.classList.remove('hidden');
}

function resetCards() {
  swiperWrapper.innerHTML = '';
}

function loginError() {
  loginErrMsg.classList.remove('hidden');
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

function clearLogin() {
  console.log(loginInputs)
  loginInputs.forEach(field => field.value = '');
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

export default { userName, sidebar, agentTotals, userTotals, userTrips, destinationsDropDown, resetCards, setCalendarMins, setEndCalendar, checkAllInputs, createTripEstimate, tripEstimate, logoutDrop, postDeclaration, loginError, serverError, disableElement, clearLogin, clearInputs, login };