class DestRepo {
  constructor(destinations) {
    this.destinations = destinations;
  };

  findDestByID(id) {
    const destination = this.destinations.find(destination => destination.id ===id);
    return destination ? destination : false;
  };

  findDestByName(name) { //do I use this??
    const destination = this.destinations.find(destination => destination.destination === name);
    return destination ? destination : false;
  }

};

export default DestRepo;