class DestRepo {
  constructor(destinations) {
    this.destinations = destinations;
  };

  findDestById(id) {
    const destination = this.destinations.find(destination => destination.id ===id);
    return destination ? destination : false;
  };

  findDestByName(name) {
    const destination = this.destinations.find(destination => destination.destination === name);
    return destination ? destination : false;
  }

};

export default DestRepo;