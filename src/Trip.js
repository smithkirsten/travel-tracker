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
    const destination = destRepo.findDestByID(this.destinationID);
    return destination ? +((this.travelers * destination.estimatedFlightCostPerPerson) + (destination.estimatedLodgingCostPerDay * this.duration)).toFixed(2) : undefined;
  }

  calcAgentFee(destRepo) {
    const tripCost = this.calcTripCost(destRepo)
    return tripCost ? +(tripCost * .1).toFixed(2): undefined;
  }
  
  findDestName(destRepo) {
    const destination = destRepo.findDestByID(this.destinationID);
    return destination?.destination;
  }

}

export default Trip;