const dayjs = require('dayjs');

class Traveler {
  constructor(travelerInfo, trips) {
    this.id = travelerInfo.id;
    this.name = travelerInfo.name;
    this.travelerType = travelerInfo.travelerType;
    this.trips = trips;
  }

};

export default Traveler;