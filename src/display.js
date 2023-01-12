
//query selectors
const welcomeMessages = document.querySelectorAll('.welcome-message');
const investDisp = document.getElementById('investDisp');
const totalTrips = document.getElementById('totalTripsDisp');
const sassyDisp = document.getElementById('sassyDisp')


function userName(traveler) {
  if(!traveler) {
    welcomeMessages.forEach(message => message.innerText = 'Welcome, Traveler!');
  } else {
    welcomeMessages.forEach(message => message.innerText = `Welcome, ${traveler}`);
  }
};


function userTrips(traveler, destinations) {
  if(traveler.trips.length < 1) {
    investDisp.innerText = 'Escape is calling...';
    totalTrips.innerText = 'Book your first trip';
    sassyDisp.innerText = 'and leave your real life behind';
  } else {
    investDisp.innerText = `You have invested ${traveler.calcTotalSpent(destinations)} in avoidance`
    totalTrips.innerText = `It has brought you to ${traveler.trips.length} new places`
    sassyDisp.innerText = 'but the things it has gotten you out of is priceless'
  }
}



export default { userName, userTrips };