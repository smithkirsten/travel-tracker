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
    expect(agent.traveler[0]).to.be.an.instanceOf(Traveler);
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
    expect(agent.destRepo.destinations.length).to.equal(8)
  });

  it('should calculate total income generated for this year', () => {
    //Total income generated this year (should be 10% of user trip cost)
  });

  it('find travelers on trips for today', () => {
    //Travelers on trips for today’s date (number, names, however you want to display this!)
      //return array of trips to display the trips and a '# of travelers on trips today'
  });

  it('should be able to search user by name', () => {
    //return an object to populate a traveler card displayed to agent
    //View their name, a list of all of their trips, and the total amount they’ve spent (including 10% agent cut)
  });

  it('should be able to locate a user with a trip id', () => {});

  it('should be able to approve and deny pending trips', () => {
    //I should be able to see and approve / deny trip requests
      //dynamic method that takes in a boolean (approve if true, deny if false)
  });

  it('should be able to cancel a trip for a user', () => {
    //Delete an upcoming trip for that user
    //deletes from data model
  });
});