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
  let badTrip;
  beforeEach(() => {
    trip = new Trip(tripTestData[0]);
    destRepo = new DestRepo(destTestData);
    badTrip = new Trip ({});
  });

  it('should be an instance of Trip', () => {
    expect(trip).be.an.instanceof(Trip);
  });

  it('should have an id, userId, and destinationId', () => {
    expect(trip.id).to.equal(1);
    expect(trip.userID).to.equal(5);
    expect(trip.destinationID).to.equal(49);
  });

  it('should have a number of travelers, date, and duration', () => {
    expect(trip.travelers).to.equal(1);
    expect(trip.date).to.equal("2022/09/16");
    expect(trip.duration).to.equal(8);
  });

  it('should have optional properties for: status that defaults to pending and suggestedActivities that defaults to an empty array', () => {
    const trip2 = new Trip({ id: 2, userId: 6, destinationID: 22, travelers: 3, date: "2023/10/02", duration: 10 })
    expect(trip2.status).to.equal("pending");
    expect(trip.status).to.equal("approved");
    expect(trip.suggestedActivities).to.deep.equal([]);
  });

  it('should calculate a 10% agent fee for each trip', () => {
    expect(trip.calcAgentFee(destRepo)).to.equal(529);
    expect(badTrip.calcAgentFee(destRepo)).to.equal(undefined);
  });

  it('should calculate the cost of the trip, excluding 10% agent fee', () => {
    expect(trip.calcTripCost(destRepo)).to.equal(5290);
    expect(badTrip.calcTripCost(destRepo)).to.equal(undefined);
  });

  it('should return the destination as a string', () => {
    expect(trip.findDestName(destRepo)).to.equal('Castries, St Lucia');
    expect(badTrip.findDestName(destRepo)).to.equal(undefined);
  });
});