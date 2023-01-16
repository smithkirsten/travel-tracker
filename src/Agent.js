const dayjs = require('dayjs');
import Trip from '../src/Trip';
import Traveler from '../src/Traveler'
import DestRepo from '../src/DestRepo'

class Agent {
  constructor(travelers, destRepo) {
    this.travelers = travelers;
    this.destRepo = destRepo;
  }
}

export default Agent;