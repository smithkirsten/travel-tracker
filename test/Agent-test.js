const dayjs = require('dayjs');
const chai = require("chai");
const expect = chai.expect;

import travelersTestData from './traveler-test-data';
import tripTestData from './trips-test-data';
import destTestData from './destination-test-data';
import Trip from '../src/Trip';
import Traveler from '../src/Traveler'
import DestRepo from '../src/DestRepo'
import Agent from '../src/Agent'


describe('Agent', () => {
  let travelers;
  let trips;
  let destRepo;
  let agent;
  beforeEach(()=> {
    trips = tripTestData.map(trip => new Trip(trip));
    travelers = travelersTestData.map(traveler => {
      const userTrips = trips.filter(trip => trip.userID === traveler.id);
      return new Traveler (traveler, userTrips);
    })
    destRepo = new DestRepo(destTestData);
    agent = new Agent(travelers, destRepo);
    //will need to filter trips in promise resolve and assign to travelers before passing into agent?
  })

  it('should be an instance of Agent', () => {
    expect(agent).to.be.an.instanceOf(Agent);
  });

  it('should hold an array of traveler instances', () => {
    expect(agent.travelers.length).to.equal(5);
    expect(agent.travelers[0]).to.be.an.instanceOf(Traveler);
    expect(agent.travelers[1].name).to.equal("Rachael Vaughten");
    expect(agent.travelers[1].trips.length).to.equal(2);
    expect(agent.travelers[1].trips[0]).to.deep.equal( {
      id: 4,
      userID: 2,
      destinationID: 14,
      travelers: 2,
      date: "2022/02/25",
      duration: 10,
      status: "approved",
      suggestedActivities: [ ]
      })
  });

  it('should hold the destRepo object as a property', () => {
    expect(agent.destRepo).to.be.an.instanceOf(DestRepo);
    expect(agent.destRepo.destinations.length).to.equal(8);
  });

  it('should calculate total income generated for this year', () => {
    expect(agent.calcYearsIncome('2023')).to.equal(255);
    expect(agent.calcYearsIncome('2024')).to.equal(0)
  });

  it('should find travelers on trips for today', () => {
    //Travelers on trips for today’s date (number, names, however you want to display this!)
      //return array of trips to display the trips and a '# of travelers on trips today'
    expect(agent.todaysTrips(dayjs())).to.equal(0);
    expect(agent.todaysTrips("2022/5/29").length).to.equal(2);
    expect(agent.todaysTrips("2022/5/29")[0]).to.deep.equal(  {
      id: 7,
      userID: 2,
      destinationID: 17,
      travelers: 5,
      date: "2022/5/28",
      duration: 20,
      status: "approved",
      suggestedActivities: [ ]
      })
  });

  it('should be able to find a traveler by id', () => {
    expect(agent.findTravelerByID(5).name).to.equal("Tiffy Grout");
    expect(agent.findTravelerByID(10)).to.equal(undefined)
  })

  it('should be able to search user by name', () => {
    expect(agent.findTravelerByName("Leila Thebeaud").id).to.deep.equal(4);
    expect(agent.findTravelerByName("Peanut Butter")).to.equal(undefined);
  });

  it('should be able to approve pending trips', () => {
    agent.approveTrip(9, 'approved');
    expect(agent.travelers[0].trips[2].status).to.equal('approved')
  });

  it('should be able to cancel a trip for a user', () => {
    agent.deleteTrip(1);
    expect(agent.travelers[4].findTrip(1)).to.equal(undefined)
  });

  it('should find all pending trips for all users', () => {
    expect(agent.pendingTrips()).to.deep.equal ([{
      id: 9,
      userID: 1,
      destinationID: 17,
      travelers: 2,
      date: "2023/04/30",
      duration: 5,
      status: "pending",
      suggestedActivities: [ ]
    }])
    agent.approveTrip(9);
    expect(agent.pendingTrips()).to.equal(undefined);
  })
});