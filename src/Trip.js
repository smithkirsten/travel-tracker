const dayjs = require('dayjs');

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
}

export default Trip;