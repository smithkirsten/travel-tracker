const dayjs = require('dayjs');

class Traveler {
  constructor(travelerInfo, trips) {
    this.id = travelerInfo.id;
    this.name = travelerInfo.name;
    this.travelerType = travelerInfo.travelerType;
    this.trips = trips;
  };

  findTrip(id) {
    const trip = this.trips.find(trip => trip.id === id);
    return trip ? trip : false;
  };

  calcTotalSpent(destRepo) {
    const total = this.trips?.reduce((total, trip) => {
      total += trip.calcTripCost(destRepo) + trip.calcAgentFee(destRepo);
      return total;
    }, 0);
    return total ? total.toFixed(2) : false;
  };

  tripsByStatus(status) {
    const trips = this.trips?.filter(trip => trip.status === status);
    if(!this.trips) {
      return undefined;
    }
    return trips.length > 0 ? trips : undefined;
  };

  findTripsByDate(prefix, date) {
    let trips;
    if(prefix === 'pre') {
      trips = this.trips?.filter(trip => dayjs(date).isAfter(dayjs(trip.date)));
      return trips.length > 0 ? trips : undefined; 
    } else if(prefix === 'post') {
      trips = this.trips?.filter(trip => dayjs(date).isBefore(dayjs(trip.date)));
      return trips.length > 0 ? trips : undefined;
    }
  }
};

export default Traveler;