const dayjs = require('dayjs');

class Traveler {
  constructor(travelerInfo, trips) {
    this.id = travelerInfo.id;
    this.name = travelerInfo.name;
    this.travelerType = travelerInfo.travelerType;
    this.trips = trips;
  }

  findTrip(id) {
    const trip = this.trips.find(trip => trip.id === id);
    return trip ? trip : false;
  }

  

};

export default Traveler;