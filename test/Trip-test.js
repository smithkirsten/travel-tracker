const dayjs = require('dayjs');
const chai = require("chai");
const expect = chai.expect;

import Trip from '../src/Trip';
import DestRepo from '../src/DestRepo'
import destTestData from './destination-test-data';
import tripTestData from './trips-test-data';

// {
//   id: 1,
//   userID: 5,
//   destinationID: 49,
//   travelers: 1,
//   date: "2022/09/16",
//   duration: 8,
//   status: "approved",
//   suggestedActivities: [ ]
//   }

describe('Trip', () => {
  let trip;
  let destRepo;
  beforeEach(() => {
    trip = new Trip(tripTestData[0]);
    destRepo = new DestRepo(destTestData);
  })
});