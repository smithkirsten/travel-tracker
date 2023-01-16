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

  it('should be an instance of Agent', () => {});

  it('should hold an array of traveler instances', () => {});

  it('should hold the destRepo object as a property')

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