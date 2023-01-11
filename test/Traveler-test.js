const chai = require("chai");
// const { default: Traveler } = require("../src/Traveler");
const expect = chai.expect;

import Traveler from '../src/Traveler';
import travelersTestData from './traveler-test-data';
import tripTestData from './trips-test-data';



describe('Traveler', () => {
  let traveler;
  let badData = {};
  beforeEach(() => {
    traveler = new Traveler(travelersTestData[0]);
  });

  it('should be an instance of Traveler', () => {
    expect(traveler).be.an.instanceof(Traveler);
  });

  it('should have an id and name', () => {
    expect(traveler.id).to.equal(1);
    expect(traveler.name).to.equal('Ham Leadbeater');
  });
  
  it('should have a travelType property and a trips property that defaults to an empty array', () => {
    expect(traveler.travelType).to.equal('relaxer');
    expect(traveler.trips).to.deep.equal([]);

    traveler.trips = tripTestData.filter(trip => trip.userID === traveler.id);
    expect(traveler.trips.length).to.equal(2)
    expect(traveler.trips[0]).to.deep.equal({
      id: 5,
      userID: 1,
      destinationID: 29,
      travelers: 3,
      date: "2022/04/30",
      duration: 18,
      status: "approved",
      suggestedActivities: [ ]
    })
  });

  it('should calculate total cost of all trips', () => {
    expect(traveler.calcTotalCosts()).to.equal();
  });

  it('should be able to filter trips by status', () => {
    expect(traveler.tripsByStatus()).to.equal();
  });

});