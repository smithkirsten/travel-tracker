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

  calcTotalSpent(destRepo) {
    const total = this.trips?.reduce((total, trip) => {
      total += trip.calcTripCost(destRepo) + trip.calcAgentFee(destRepo);
      return total;
    }, 0);

    return total ? total : false;
  }

};

export default Traveler;