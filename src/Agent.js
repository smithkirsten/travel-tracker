const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);
import Trip from '../src/Trip';
import Traveler from '../src/Traveler'
import DestRepo from '../src/DestRepo'

class Agent {
  constructor(travelers, destRepo) {
    this.travelers = travelers;
    this.destRepo = destRepo;
  }
  calcYearsIncome(year) {
    const start = dayjs(`${year}-01-01`)
    const end = dayjs(`${year}-12-31`)
    const income = this.travelers.reduce((income, traveler) => {
      const tripsThatYear = traveler.trips.filter(trip => {
        return dayjs(trip.date).isBetween(start, end);
      })
      tripsThatYear.forEach(trip => {
        income += trip.calcAgentFee(this.destRepo);
      })
      return income;
    }, 0)
    return income;
  }

  todaysTrips(today) {
    //for each trip: calculate date range based on duration
      //date add duration
      //ask if today isBetween start and end date
    const trips = this.travelers.reduce((trips, traveler) => {
      const tripsToday = traveler.trips.filter(trip => {
        const end = dayjs(trip.date).add(trip.duration, 'day');
        return dayjs(today).isBetween(dayjs(trip.date), end)
      })
      trips.push(tripsToday);
      return trips.flat();
    }, [])
    return trips.length > 0 ? trips : 0;
  }
}

export default Agent;