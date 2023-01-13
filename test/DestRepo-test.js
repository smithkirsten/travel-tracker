const chai = require("chai");
const expect = chai.expect;
import destTestData from './destination-test-data'
import DestRepo from '../src/DestRepo'

describe('DestRepo', () => {
  let destRepo;
  beforeEach(() => {
    destRepo = new DestRepo(destTestData);
  });

  it('should be an instance of DestRepo', () => {
    expect(destRepo).to.be.an.instanceOf(DestRepo);
  });

  it('should contain an array of all destination objects', () => {
    expect(destRepo.destinations.length).to.equal(8);
    expect(destRepo.destinations[0]).to.deep.equal({
      id: 49,
      destination: "Castries, St Lucia",
      estimatedLodgingCostPerDay: 650,
      estimatedFlightCostPerPerson: 90,
      image: "https://images.unsplash.com/photo-1524478075552-c2763ea171b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80",
      alt: "aerial photography of rocky mountain under cloudy sky"
    });
  });

  it('should return a destination from its id', () => {
    expect(destRepo.findDestByID(39)).to.deep.equal({
      id: 39,
      destination: "Porto, Portugal",
      estimatedLodgingCostPerDay: 995,
      estimatedFlightCostPerPerson: 90,
      image: "https://images.unsplash.com/photo-1564644929137-34b018daf461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1778&q=80",
      alt: "looking over the water on to a city on a hill"
    });
    expect(destRepo.findDestByID(100)).to.equal(false)
  });

  it('should find a destination from its name', () => {
    expect(destRepo.findDestByName("Porto, Portugal")).to.deep.equal({
      id: 39,
      destination: "Porto, Portugal",
      estimatedLodgingCostPerDay: 995,
      estimatedFlightCostPerPerson: 90,
      image: "https://images.unsplash.com/photo-1564644929137-34b018daf461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1778&q=80",
      alt: "looking over the water on to a city on a hill"
    });
    expect(destRepo.findDestByName('Ohio')).to.equal(false)
  });
});