const dayjs = require('dayjs');
const chai = require("chai");
const expect = chai.expect;

import Trip from '../src/Trip';
import DestRepo from '../src/DestRepo'
import destTestData from './destination-test-data';
import tripTestData from './trips-test-data';

describe('Trip', () => {
  let trip;
  let destRepo;
  beforeEach(() => {
    trip = new Trip(tripTestData[0]);
    destRepo = new DestRepo(destTestData);
  })
});