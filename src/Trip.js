// const dayjs = require('dayjs');

class Trip {
  constructor(tripInfo) {
    this.id = tripInfo.id;
    this.userID = tripInfo.userID;
    this.destinationID = tripInfo.destinationID;
    this.travelers = tripInfo.travelers;
    this.date = tripInfo.date;
    this.duration = tripInfo.duration;
    this.status = tripInfo.status || 'pending';
    this.suggestedActivities = tripInfo.suggestedActivities || [];
  }
  
  calcTripCost(destRepo) {
    //calculates trip without agent fee
    //must be combined with agent fee to display total cost to user
    const destination = destRepo.findDestByID(this.destinationID);
    return destination ? (this.travelers * destination.estimatedFlightCostPerPerson) + (destination.estimatedLodgingCostPerDay * this.duration) : false;
  }

  calcAgentFee(destRepo) {
    const tripCost = this.calcTripCost(destRepo)
    return tripCost ? tripCost * .1: false;
  }
  
  findDestName(destRepo) {
    const destination = destRepo.findDestByID(this.destinationID);
    return destination ? destination.destination : false;
  }

}

export default Trip;