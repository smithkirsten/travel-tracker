// let travelers;
// let destinations;
// let trips;

//pass in travelers, travelers/id, trips, or destinations
function getData(type) {
  const url = `http://localhost:3001/api/v1/${type}`;
  return fetch(url)
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw Promise.reject(response)
      }
    })
}

//pass in trips,updateTrip, destinations
function sendData(method, type, postData) {
  const url = `http://localhost:3001/api/v1/${type}`;
  return promise = fetch(url, {
    method: method,
    body: JSON.stringify(postData),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => {
    if(!response.ok) {
      throw new Error("Data failed to reach the server");
    }
    return response.json();
  })
};

export default { getData, sendData };
