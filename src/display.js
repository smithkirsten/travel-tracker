//query selectors
const welcomeMessages = document.querySelectorAll('.welcome-message');



function userName(traveler) {
  console.log(traveler)
  if(!traveler) {
    welcomeMessages.forEach(message => message.innerText = 'Welcome, Traveler!');
  } else {
    welcomeMessages.forEach(message => message.innerText = `Welcome, ${traveler}`);
  }
}


function userTrips(trips) {

}



export default { userName, userTrips };