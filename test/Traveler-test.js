const chai = require("chai");
// const { default: Traveler } = require("../src/Traveler");
const expect = chai.expect;

import Traveler from '../src/Traveler';
import travelersTestData from './traveler-test-data';
import tripTestData from './trips-test-data';


describe('Traveler', () => {
  let traveler;
  let badData;
  let destRepo;
  beforeEach(() => {
    traveler = new Traveler(travelersTestData[0]);
    badData = new Traveler({});
    destRepo = new destRepo(destTestData)
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

    traveler.trips = tripTestData.filter(trip => trip.userID === traveler.id);//instantiate into trips

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
    expect(traveler(4)).to.equal(false)
  });

  it('should calculate total cost of all trips', () => {
    //create method in trips to calc 10% of trip
    //create method in trips to calc cost of trip
    4740 
    expect(traveler.calcTotalCosts()).to.equal();
    expect(badData.calcTotalCosts()).to.equal(false) //or could return null to use ?? in future functions?
  });

  it('should be able to filter trips by status', () => {
    expect(traveler.tripsByStatus(traveler.filterStatus('pending'))).to.equal();
    expect(traveler.tripsByStatus(traveler.filterStatus('approved'))).to.equal();
    expect(badData.tripsByStatus('pending')).to.equal(false);
    expect(badData.tripsByStatus('approved').to.equal(false));
  });

  it('should be able to filter for upcoming trips', () => {
    expect(traveler.findUpcomingTrips('2023/1/11')).to.deep.equal({
      id: 9,
      userID: 1,
      destinationID: 17,
      travelers: 2,
      date: "2023/04/30",
      duration: 5,
      status: "pending",
      suggestedActivities: [ ]
    })
    expect(traveler.findUpcomingTrips('2023/05/01')).to.equal(false);

  });
});