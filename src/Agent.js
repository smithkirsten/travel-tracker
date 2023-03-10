const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

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
    return +income.toFixed(2);
  }

  pendingTrips() {
    const pending = this.travelers.reduce((pending, traveler) => {
      pending.push(traveler.trips.filter(trip => trip.status === 'pending'));
      return pending.flat();
    }, []);
    return pending.length > 0 ? pending : undefined; 
  }

  todaysTrips(today) {
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

  findTravelerByID(id) {
    return this.travelers.find(traveler => traveler.id === id);
  }

  findTravelerByName(name) {
    return this.travelers.find(traveler => traveler.name === name);
  }

  approveTrip(id) {
    this.travelers.forEach(traveler => {
      traveler.trips.forEach(trip => {
        if(trip.id === id) {
          trip.status = 'approved';
        }
      })
    })
  }

  deleteTrip(id) {
    this.travelers.forEach(traveler => {
      traveler.trips.forEach((trip, index) => {
        if(trip.id === id) {
          traveler.trips.splice(index, 1);
        }
      })
    })
  }
}

export default Agent;