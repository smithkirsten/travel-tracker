const chai = require("chai");
const expect = chai.expect;
const dayjs = require('dayjs')

import Traveler from '../src/Traveler';
import travelersTestData from './traveler-test-data';
import tripTestData from './trips-test-data';
import DestRepo from '../src/DestRepo'
import destTestData from './destination-test-data';
import Trip from '../src/Trip';

describe('Traveler', () => {
  let traveler;
  let badData;
  let destRepo;
  let trips;
  beforeEach(() => {
    destRepo = new DestRepo(destTestData)
    traveler = new Traveler(travelersTestData[0], trips);
    trips = tripTestData.filter(trip => trip.userID === traveler.id).map(trip => new Trip(trip));
    badData = new Traveler({});
  });

  it('should be an instance of Traveler', () => {
    expect(traveler).be.an.instanceof(Traveler);
  });

  it('should have an id and name', () => {
    expect(traveler.id).to.equal(1);
    expect(traveler.name).to.equal('Ham Leadbeater');
  });
  
  it('should have a travelType property and a trips property', () => {
    expect(traveler.travelerType).to.equal('relaxer');
    expect(traveler.trips.length).to.equal(3)
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

  it('should be able to find trip by id', () => {
    expect(traveler.findTrip(5)).to.deep.equal({
      id: 5,
      userID: 1,
      destinationID: 29,
      travelers: 3,
      date: "2022/04/30",
      duration: 18,
      status: "approved",
      suggestedActivities: [ ]
      })
    expect(traveler.findTrip(4)).to.equal(undefined)
  });

  it('should calculate total cost of all trips', () => {
    expect(traveler.calcTotalSpent(destRepo)).to.equal('10329.00');
    expect(badData.calcTotalSpent(destRepo)).to.equal(undefined) //or could return null to use ?? in future functions?
  });

  it('should be able to filter trips by status', () => {
    expect(traveler.tripsByStatus('pending').length).to.equal(1);
    expect(traveler.tripsByStatus('pending')[0].id).to.equal(9);
    expect(traveler.tripsByStatus('approved')[0].id).to.equal(5);
    expect(badData.tripsByStatus('pending')).to.equal(undefined);
    expect(badData.tripsByStatus('approved')).to.equal(undefined);
  });

  it('should be able to filter for past and upcoming trips', () => {
    const upcomingTrips = traveler.findTripsByDate('post', '2023/1/11');
    expect(upcomingTrips[0].id).to.equal(9);
    expect(traveler.findTripsByDate('post', '2023/05/01')).to.equal(undefined);

    const pastTrips = traveler.findTripsByDate('pre', '2022/06/25');
    expect(pastTrips[0].id).to.equal(5);
    expect(traveler.findTripsByDate('pre', '2022/04/20')).to.equal(undefined);
  });


});